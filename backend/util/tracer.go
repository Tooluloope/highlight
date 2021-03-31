package util

// This schema/arch is taken from: https://github.com/99designs/gqlgen/blob/master/graphql/handler/apollotracing/tracer.go

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"gopkg.in/DataDog/dd-trace-go.v1/ddtrace/tracer"
)

type Tracer struct{}

var _ interface {
	graphql.HandlerExtension
	graphql.ResponseInterceptor
	graphql.FieldInterceptor
} = Tracer{}

func (Tracer) ExtensionName() string {
	return "HighlightTracer"
}

func (Tracer) Validate(graphql.ExecutableSchema) error {
	return nil
}

func (Tracer) InterceptField(ctx context.Context, next graphql.Resolver) (interface{}, error) {
	// taken from: https://docs.datadoghq.com/tracing/setup_overview/custom_instrumentation/go/#manually-creating-a-new-span
	fc := graphql.GetFieldContext(ctx)
	fieldSpan, ctx := tracer.StartSpanFromContext(ctx, "operation.field", tracer.ResourceName(fc.Field.Name))
	fieldSpan.SetTag("field.type", fc.Field.Definition.Type.String())

	start := graphql.Now()
	defer func() {
		end := graphql.Now()
		fieldSpan.SetTag("field.duration", end.Sub(start))
		fieldSpan.Finish()
	}()

	return next(ctx)
}

func (Tracer) InterceptResponse(ctx context.Context, next graphql.ResponseHandler) *graphql.Response {
	rc := graphql.GetOperationContext(ctx)
	start := rc.Stats.OperationStart
	// NOTE: This gets called for the first time at the highest level. Creates the 'tracing' value, calls the next handler
	// and returns the response.
	span, ctx := tracer.StartSpanFromContext(ctx, "graphql.operation", tracer.ResourceName(rc.Operation.Name))
	span.SetTag("backend", "main-graph")
	defer span.Finish()
	resp := next(ctx)
	end := graphql.Now()
	span.SetTag("operation.duration", end.Sub(start))
	return resp
}
