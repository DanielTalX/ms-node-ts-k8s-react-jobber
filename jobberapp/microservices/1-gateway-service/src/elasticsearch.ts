import { winstonLogger } from '@danieltalx/jobber-shared';
import { Logger } from 'winston';
import { config } from '@gateway/config';
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'apiGatewayElasticConnection', 'debug');

class ElasticSearch {
  private elasticSearchClient: Client;

  constructor() {
    this.elasticSearchClient = new Client({
      node: `${config.ELASTIC_SEARCH_URL}`
    });
  }

  public async checkConnection(): Promise<void> {
    let retryNum = 0;
    while (retryNum < 5) {
      try {
        const health: ClusterHealthResponse = await this.elasticSearchClient.cluster.health({});
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

}

export const elasticSearch: ElasticSearch = new ElasticSearch();