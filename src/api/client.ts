import { ctpClient } from './api-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { environment } from '../environment/environment';

const apiRoot: ByProjectKeyRequestBuilder = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
    projectKey: environment.projectKey,
});

const getProject = () => {
    return apiRoot.get().execute();
};

getProject().then(console.log).catch(console.error);
