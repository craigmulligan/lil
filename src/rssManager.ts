import { FeedGenerator } from './deps'
import { Options } from './types'

const { FeedOptions, Item } = FeedGenerator

export default class RSS {
  _settings: typeof FeedOptions = {};
  _items: typeof Item[] = [];

  addItem(item: typeof Item) {
    this._items.push({
      title: item.title,
      id: item.url,
      link: item.url,
      description: item.description,
      content: item.content,
    })
  }

  addSettings(settings: typeof FeedOptions) {
    this._settings = {
      ...this._settings,
      ...settings
    }
  }

  async generate() {
    const rss2 = this.feed.rss2()
    console.log(rss2)
    return rss2
  }
}
