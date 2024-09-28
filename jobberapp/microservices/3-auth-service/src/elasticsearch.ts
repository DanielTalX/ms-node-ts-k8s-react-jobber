import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse, GetResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@auth/config';
import { ISellerGig, winstonLogger } from '@danieltalx/jobber-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authElasticSearchServer', 'debug');

// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/getting-started-js.html
const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

async function checkConnection(): Promise<void> {
  let retryNum = 1;
  while (retryNum < 5) {
    log.info(`${config.MS_NAME} connecting to Elasticsearch... retry num: ${retryNum}/5`);
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`${config.MS_NAME} Elasticsearch health status - ${health.status}`);
      return;
    } catch (error) {
      log.log('error', `${config.MS_NAME} checkConnection() method:`, error);
      log.error(`Connection to Elasticsearch failed, retry num: ${retryNum}/5.`);
      retryNum++;
      if(retryNum >= 5){
        throw error;
      }
      else {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay between retries
      }
    }
  }
}

async function checkIfIndexExist(indexName: string): Promise<boolean> {
  const result: boolean = await elasticSearchClient.indices.exists({ index: indexName });
  return result;
}

async function createIndex(indexName: string): Promise<void> {
  try {
    const result: boolean = await checkIfIndexExist(indexName);
    if (result) {
      log.info(`${config.MS_NAME} Index "${indexName}" already exist.`);
    } else {
      await elasticSearchClient.indices.create({ index: indexName });
      await elasticSearchClient.indices.refresh({ index: indexName });
      log.info(`${config.MS_NAME} Created index ${indexName}`);
    }
  } catch (error) {
    log.error(`${config.MS_NAME} An error occurred while creating the index ${indexName}`);
    log.log('error', `${config.MS_NAME} createIndex() method error:`, error);
  }
}

async function getDocumentById(index: string, gigId: string): Promise<ISellerGig> {
  try {
    const result: GetResponse = await elasticSearchClient.get({
      index,
      id: gigId
    });
    return result._source as ISellerGig;
  } catch (error) {
    log.log('error', `${config.MS_NAME} elastcisearch getDocumentById() method error:`, error);
    return {} as ISellerGig;
  }
}

export { elasticSearchClient, checkConnection, createIndex, getDocumentById }