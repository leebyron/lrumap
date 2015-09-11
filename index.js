type LRUNode<K, V> = {
  key: K;
  value: V;
  next: ?LRUNode<K, V>;
  prev: ?LRUNode<K, V>;
}

export default class LRUMap<K, V> {
  maxSize: number;
  _map: Map<K, LRUNode<K, V>>;
  _head: ?LRUNode<K, V>;
  _tail: ?LRUNode<K, V>;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
    this._map = new Map();
    this._head = null;
    this._tail = null;
  }

  has(key: K): boolean {
    return this._map.has(key);
  }

  clear(): void {
    this._map.clear();
  }

  get(key: K): V {
    var node = this._map.get(key);
    if (node) {
      return node.value;
    }
  }

  set(key: K, value: V): Map<K, V> {
    var node = this._map.get(key);
    if (node) {
      node.value = value;
    } else {
      if (this.size === this.maxSize && this._tail) {
        this.delete(this._tail.key);
      }
      node = { key, value, next: this._head, prev: null };
      this._head = node;
      if (!this._tail) {
        this._tail = node;
      }
      this._map.set(key, node);
    }
    return this;
  }

  delete(key: K): boolean {
    console.log(`deleting ${key}`)
    var node = this._map.get(key);
    if (!node) {
      return false;
    }
    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this._tail = node.prev;
    }
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this._head = node.next;
    }
    return this._map.delete(key);
  }

  clear(): void {
    this._head = null;
    this._tail = null;
    this._map.clear();
  }

  keys(): Iterator<K> {
    return new LRUMapIterator(this._head, 0);
  }

  values(): Iterator<V> {
    return new LRUMapIterator(this._head, 1);
  }

  entries(): Iterator<[K, V]> {
    return new LRUMapIterator(this._head, 2);
  }
}

Object.defineProperty(LRUMap.prototype, 'size', {
  get() {
    return this._map.size;
  }
});

class LRUMapIterator {
  _node: ?LRUNode<any, any>;
  _mode: number;

  constructor(node: ?LRUNode<any, any>, mode: number) {
    this._node = node;
    this._mode = mode;
  }

  [Symbol.iterator]() {
    return this;
  }

  next(): any {
    var node = this._node;
    if (!node) {
      return { value: undefined, done: true };
    }
    this._node = node.next;
    var value =
      this._mode === 0 ? node.key :
      this._mode === 1 ? node.value :
      [ node.key, node.value ];
    return { value, done: false };
  }
}
