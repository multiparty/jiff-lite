type ListNode<T> = {
    object: T;
    next: ListNode<T> | null;
    previous: ListNode<T> | null;
  };
  
  type DoublyLinkedList<T> = {
    head: ListNode<T> | null;
    tail: ListNode<T> | null;
    pushTail(obj: T): ListNode<T>;
    pushHead(obj: T): void;
    popHead(): ListNode<T> | null;
    extend(l2: DoublyLinkedList<T>): DoublyLinkedList<T>;
    remove(ptr: ListNode<T>): void;
    slice(ptr: ListNode<T>): void;
  };
  
  function createDoublyLinkedList<T>(): DoublyLinkedList<T> {
    let list: DoublyLinkedList<T> = {
      head: null,
      tail: null,
  
      pushTail: function (obj: T): ListNode<T> {
        let node: ListNode<T> = { object: obj, next: null, previous: this.tail };
        if (!this.head) {
          this.head = node;
        } else {
          this.tail!.next = node;
        }
        this.tail = node;
        return node;
      },
  
      pushHead: function (obj: T): void {
        let node: ListNode<T> = { object: obj, next: this.head, previous: null };
        if (!this.head) {
          this.tail = node;
        } else {
          this.head.previous = node;
        }
        this.head = node;
      },
  
      popHead: function (): ListNode<T> | null {
        if (!this.head) return null;
        let poppedNode = this.head;
        this.head = this.head.next;
        if (this.head) {
          this.head.previous = null;
        } else {
          this.tail = null;
        }
        return poppedNode;
      },
  
      extend: function (l2: DoublyLinkedList<T>): DoublyLinkedList<T> {
        if (!this.head) return l2;
        if (!l2.head) return this;
        this.tail!.next = l2.head;
        l2.head.previous = this.tail;
        this.tail = l2.tail;
        return this;
      },
  
      remove: function (ptr: ListNode<T>): void {
        if (!ptr) return;
        if (ptr.previous) ptr.previous.next = ptr.next;
        if (ptr.next) ptr.next.previous = ptr.previous;
        if (ptr === this.head) this.head = ptr.next;
        if (ptr === this.tail) this.tail = ptr.previous;
      },
  
      slice: function (ptr: ListNode<T>): void {
        if (!ptr || !this.head) return;
        let current = this.head;
        while (current) {
          if (current === ptr) {
            this.head = current.next;
            if (this.head) {
              this.head.previous = null;
            } else {
              this.tail = null;
            }
            return;
          }
          current = current.next;
        }
      }
    };
  
    return list;
  }
  
  export { createDoublyLinkedList, DoublyLinkedList, ListNode };
  