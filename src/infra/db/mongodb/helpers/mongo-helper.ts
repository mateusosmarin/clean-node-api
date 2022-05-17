import { Collection, MongoClient } from 'mongodb'

class MongoHelper {
  client: MongoClient
  uri: string

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  async disconnect (): Promise<void> {
    await this.client.close()
  }

  async getCollection (name: string): Promise<Collection> {
    return this.client.db().collection(name)
  }

  map (collection: any): any {
    const { _id, ...collectionWithoutId } = collection
    return {
      id: _id,
      ...collectionWithoutId
    }
  }
}

export const mongoHelper = new MongoHelper()
