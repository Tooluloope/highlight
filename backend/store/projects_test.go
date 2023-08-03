package store

import (
	"context"
	"testing"

	"github.com/highlight-run/highlight/backend/model"
	"github.com/highlight-run/highlight/backend/util"
	"github.com/stretchr/testify/assert"
)

func TestGetProject(t *testing.T) {
	util.RunTestWithDBWipe(t, store.db, func(t *testing.T) {
		ctx := context.Background()
		_, err := store.GetProject(ctx, 1)
		assert.Error(t, err)

		project := model.Project{}
		store.db.Create(&project)

		foundProject, err := store.GetProject(ctx, project.ID)
		assert.NoError(t, err)
		assert.Equal(t, project.ID, foundProject.ID)
	})
}
