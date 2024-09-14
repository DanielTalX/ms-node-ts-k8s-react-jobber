import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@notifications/config';
import { winstonLogger } from '@danieltalx/jobber-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug');

// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/getting-started-js.html
const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

export async function checkConnection(): Promise<void> {
  let retryNum = 0;
  while (retryNum < 5) {
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`${config.MS_NAME} Elasticsearch health status - ${health.status}`);
      return;
    } catch (error) {
      retryNum++;
      log.log('error', `${config.MS_NAME} checkConnection() method:`, error);
      log.error(`Connection to Elasticsearch failed, retry num: ${retryNum}/5.`);
      if(retryNum >= 5){
        throw error;
      }
      else {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay between retries
      }
    }
  }
}
