export class CounterModel {
  private value = 0

  getValue() {
    return this.value
  }

  increment() {
    this.value += 1
    return this.value
  }
}