import {
    DEMO_WORKSPACE_APPLICATION_ID,
    DEMO_WORKSPACE_PROXY_APPLICATION_ID,
} from '@components/DemoWorkspaceButton/DemoWorkspaceButton';
import { useGetProjectQuery } from '@graph/hooks';
import { isOnPrem } from '@util/onPrem/onPremUtils';
import { useParams } from '@util/react-router/useParams';
import { H } from 'highlight.run';
import React, { FunctionComponent, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import useFetch from 'use-http';

import { useAuthContext } from '../../authentication/AuthContext';
import ButtonLink from '../../components/Button/ButtonLink/ButtonLink';
import Collapsible from '../../components/Collapsible/Collapsible';
import SvgSlackLogo from '../../components/icons/SlackLogo';
import LeadAlignLayout from '../../components/layout/LeadAlignLayout';
import layoutStyles from '../../components/layout/LeadAlignLayout.module.scss';
import { RadioGroup } from '../../components/RadioGroup/RadioGroup';
import { GetBaseURL } from '../../util/window';
import { CodeBlock } from './CodeBlock/CodeBlock';
import { GatsbySetup } from './Gatsby/GatsbySetup';
import { IntegrationDetector } from './IntegrationDetector/IntegrationDetector';
import styles from './SetupPage.module.scss';

enum PlatformType {
    Html = 'HTML',
    React = 'React',
    Vue = 'Vue.js',
    NextJs = 'Next.js',
    Gatsby = 'Gatsby.js',
}

const SetupPage = ({ integrated }: { integrated: boolean }) => {
    const { admin } = useAuthContext();
    const [platform, setPlatform] = useState(PlatformType.React);
    const { project_id } = useParams<{ project_id: string }>();
    const projectIdRemapped =
        project_id === DEMO_WORKSPACE_APPLICATION_ID
            ? DEMO_WORKSPACE_PROXY_APPLICATION_ID
            : project_id;
    const { data, loading } = useGetProjectQuery({
        variables: { id: project_id },
    });

    return (
        <LeadAlignLayout>
            <div className={styles.headingWrapper}>
                <h2>Your Highlight Snippet</h2>
            </div>
            <p className={layoutStyles.subTitle}>
                Setup Highlight in your web application!
            </p>
            <RadioGroup<PlatformType>
                style={{ marginTop: 20, marginBottom: 20 }}
                selectedLabel={platform}
                labels={[
                    PlatformType.React,
                    PlatformType.Vue,
                    PlatformType.Html,
                    PlatformType.NextJs,
                    PlatformType.Gatsby,
                ]}
                onSelect={(p: PlatformType) => setPlatform(p)}
            />
            {!data?.project || loading ? (
                <Skeleton
                    height={75}
                    count={3}
                    style={{ borderRadius: 8, marginBottom: 14 }}
                />
            ) : (
                <div className={styles.stepsContainer}>
                    {platform === PlatformType.Html ? (
                        <HtmlInstructions
                            projectVerboseId={data?.project?.verbose_id}
                        />
                    ) : platform === PlatformType.Gatsby ? (
                        <GatsbySetup
                            projectVerboseId={data?.project?.verbose_id}
                        />
                    ) : (
                        <JsAppInstructions
                            projectVerboseId={data?.project?.verbose_id}
                            platform={platform}
                        />
                    )}
                    <Section title="Identifying Users">
                        <p>
                            To tag sessions with user specific identifiers
                            (name, email, etc.), you can call the
                            <code>
                                {'H.identify(id: string, object: Object)'}
                            </code>{' '}
                            method in your app. Here's an example:
                        </p>
                        <CodeBlock
                            language="javascript"
                            onCopy={() => {
                                H.track(
                                    'Copied Code Snippet (Highlight Event)',
                                    { copied: 'code snippet' }
                                );
                            }}
                            text={`H.identify(\n\t'${
                                admin?.email || 'eliza@gmail.com'
                            }', \n\t{id: 'ajdf837dj', phone: '867-5309'}\n)`}
                        />
                    </Section>
                    <Section
                        title={
                            <span className={styles.sectionTitleWithIcon}>
                                Verify Installation
                                {integrated && (
                                    <IntegrationDetector
                                        verbose={false}
                                        integrated={integrated}
                                    />
                                )}
                            </span>
                        }
                        id="highlightIntegration"
                    >
                        <p>
                            Please follow the setup instructions above to
                            install Highlight. It should take less than a minute
                            for us to detect installation.
                        </p>
                        <div className={styles.integrationContainer}>
                            <IntegrationDetector
                                integrated={integrated}
                                verbose={true}
                            />
                        </div>
                    </Section>
                    {platform === PlatformType.React && (
                        <Section title="React Error Boundary">
                            <p>
                                Highlight's <code>@highlight-run/react</code>{' '}
                                package includes React components to improve
                                both the developer and customer experience. We
                                recommend using our{' '}
                                <code>{'<ErrorBoundary/>'}</code> to catch
                                errors and provide an error recovery mechanism
                                for your users.
                            </p>
                            <CodeBlock
                                language="javascript"
                                onCopy={() => {
                                    H.track(
                                        'Copied Code Snippet (Highlight Event)',
                                        { copied: 'code snippet' }
                                    );
                                }}
                                text={`import { ErrorBoundary } from '@highlight-run/react';

const App = () => {
	return (
		<ErrorBoundary showDialog>
			<YourMainAppComponent />
		</ErrorBoundary>
	)
}`}
                            />

                            <div className={styles.integrationContainer}>
                                <ButtonLink
                                    anchor
                                    href="https://docs.highlight.run/reactjs-integration"
                                    trackingId="SetupPageDocsReact"
                                >
                                    Learn More about the React Package
                                </ButtonLink>
                            </div>
                        </Section>
                    )}
                    <Section
                        title={
                            <span className={styles.sectionTitleWithIcon}>
                                Enable Slack Alerts
                                {data.workspace!.slack_webhook_channel ? (
                                    <IntegrationDetector
                                        verbose={false}
                                        integrated={integrated}
                                    />
                                ) : (
                                    <SvgSlackLogo height="15" width="15" />
                                )}
                            </span>
                        }
                        id="slackAlerts"
                    >
                        <p>
                            Get notified of different events happening in your
                            application.
                        </p>
                        <div className={styles.integrationContainer}>
                            <ButtonLink
                                to={`/${projectIdRemapped}/alerts`}
                                trackingId="ConfigureAlertsFromSetupPage"
                            >
                                Configure Your Alerts
                            </ButtonLink>
                        </div>
                    </Section>
                    <Section
                        title={
                            <span className={styles.sectionTitleWithIcon}>
                                Read the Docs
                            </span>
                        }
                        id="slackAlerts"
                    >
                        <p>
                            Interested in learning how Highlight can help you
                            move faster? Check out our docs!
                        </p>
                        <p>Some things you'll learn more about are:</p>
                        <ul>
                            <li>
                                <a
                                    href="https://docs.highlight.run/comments"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Collaborating with comments
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://docs.highlight.run/user-feedback"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Collecting user feedback with retained
                                    context
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://docs.highlight.run/network-devtools"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Debugging network requests
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://docs.highlight.run/deployment-overview"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    On-prem
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://docs.highlight.run/sourcemaps"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Getting more useful error stack traces if
                                    you don't ship sourcemap
                                </a>
                            </li>
                        </ul>

                        <div className={styles.integrationContainer}>
                            <ButtonLink
                                anchor
                                href="https://docs.highlight.run/"
                                trackingId="SetupPageDocs"
                            >
                                Read the Docs
                            </ButtonLink>
                        </div>
                    </Section>
                </div>
            )}
        </LeadAlignLayout>
    );
};

const HtmlInstructions = ({
    projectVerboseId,
}: {
    projectVerboseId: string;
}) => {
    const { loading, error, data = '' } = useFetch<string>(
        'https://unpkg.com/highlight.run@latest',
        {},
        []
    );
    const codeStr = data.replace(/(\r\n|\n|\r)/gm, '');

    return (
        <Section title="Installing the SDK">
            <p>
                Copy and paste the{' '}
                <span className={styles.codeBlockBasic}>{'<script/>'}</span>{' '}
                below into the
                <span className={styles.codeBlockBasic}>{'<head/>'}</span> of
                every page you wish to record.
            </p>
            <div>
                {loading || error ? (
                    <Skeleton />
                ) : (
                    <CodeBlock
                        language="html"
                        onCopy={() => {
                            H.track('Copied Script (Highlight Event)', {
                                copied: 'script',
                            });
                        }}
                        text={`<script>
${codeStr}
window.H.init('${projectVerboseId}'${
                            isOnPrem
                                ? ', {backendUrl: "' +
                                  GetBaseURL() +
                                  '/public"}'
                                : ''
                        })
</script>`}
                    />
                )}
            </div>
        </Section>
    );
};

const JsAppInstructions = ({
    platform,
    projectVerboseId,
}: {
    platform: PlatformType;
    projectVerboseId: string;
}) => {
    return (
        <>
            <Section title="Installing the SDK">
                {platform === PlatformType.React ? (
                    <>
                        <p>
                            Install the <code>highlight.run</code> and{' '}
                            <code>@highlight-run/react</code> packages.
                        </p>
                        <CodeBlock
                            text={`npm install highlight.run @highlight-run/react`}
                            language="shell"
                        />
                        <p>or with Yarn:</p>
                        <CodeBlock
                            text={`yarn add highlight.run @highlight-run/react`}
                            language="shell"
                        />
                    </>
                ) : (
                    <>
                        <p>
                            Install the <code>{'highlight.run'}</code> package.
                        </p>
                        <CodeBlock
                            text={`npm install highlight.run`}
                            language="shell"
                        />
                        <p>or with Yarn:</p>
                        <CodeBlock
                            text={`yarn add highlight.run`}
                            language="shell"
                        />
                    </>
                )}
            </Section>
            <Section title="Initializing Highlight">
                <p>Initialize the SDK by importing Highlight like so: </p>
                <CodeBlock
                    text={`import { H } from 'highlight.run'`}
                    language="javascript"
                />
                <p>
                    and then calling{' '}
                    <code>{getInitSnippet(projectVerboseId)}</code> as soon as
                    you can in your site's startup process. You can configure
                    how Highlight records with the{' '}
                    <a
                        href="https://docs.highlight.run/reference#options"
                        target="_blank"
                        rel="noreferrer"
                    >
                        options
                    </a>
                    .
                </p>
                <p>
                    {platform !== PlatformType.NextJs ? (
                        <CodeBlock
                            language="javascript"
                            text={`${getInitSnippet(projectVerboseId, true)}`}
                        />
                    ) : (
                        <CodeBlock
                            language="javascript"
                            text={`${getInitSnippet(
                                projectVerboseId
                            )} // ${projectVerboseId} is your PROJECT_ID`}
                        />
                    )}
                </p>
                <p>
                    In{' '}
                    {platform === PlatformType.React
                        ? 'React'
                        : platform === PlatformType.Vue
                        ? 'Vue'
                        : 'Next.js'}
                    , it can be called at the top of your main component's file
                    like this:
                </p>
                {platform === PlatformType.React ? (
                    <CodeBlock
                        language="javascript"
                        text={`import React from 'react';
import App from './App';
import { H } from 'highlight.run'

${getInitSnippet(projectVerboseId)}

ReactDOM.render(<App />, document.getElementById('root'));`}
                    />
                ) : platform === PlatformType.Vue ? (
                    <CodeBlock
                        language="javascript"
                        text={`import { createApp } from 'vue';
import App from './App.vue';
import { H } from 'highlight.run';

${getInitSnippet(projectVerboseId, true)}

createApp(App).mount('#app');`}
                    />
                ) : (
                    <CodeBlock
                        language="javascript"
                        text={`import { H } from 'highlight.run';

${getInitSnippet(projectVerboseId)}

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp`}
                    />
                )}
            </Section>
        </>
    );
};

type SectionProps = {
    title: string | React.ReactNode;
    id?: string;
};

export const Section: FunctionComponent<SectionProps> = ({
    children,
    id,
    title,
}) => {
    return (
        <Collapsible title={title} id={id}>
            {children}
        </Collapsible>
    );
};

export default SetupPage;

const getInitSnippet = (projectId: string, withOptions = false) =>
    withOptions
        ? `H.init('${projectId}', {
  environment: 'production',
  enableStrictPrivacy: false,${
      isOnPrem ? '\n  backendUrl: "' + GetBaseURL() + '/public",' : ''
  }
});`
        : `H.init('${projectId}');`;
