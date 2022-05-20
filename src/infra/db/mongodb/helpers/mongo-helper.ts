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

  map (document: any): any
  map (collection: any[]): any[]
  map (documentOrCollection: any | any[]): any | any[] {
    if (Array.isArray(documentOrCollection)) {
      return documentOrCollection.map((c) => this.map(c))
    }
    const { _id, ...withoutId } = documentOrCollection
    return {
      id: _id,
      ...withoutId
    }
  }
}

export const mongoHelper = new MongoHelper()
