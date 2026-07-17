"use client";

type Subscriber = (time: number) => void;

class Tempus {
  private animationFrame = 0;

  private readonly subscribers = new Set<Subscriber>();

  private readonly tick = (time: number) => {
    this.subscribers.forEach((subscriber) => subscriber(time));
    this.animationFrame = window.requestAnimationFrame(this.tick);
  };

  subscribe(subscriber: Subscriber) {
    this.subscribers.add(subscriber);

    if (this.subscribers.size === 1) {
      this.animationFrame = window.requestAnimationFrame(this.tick);
    }

    return () => {
      this.subscribers.delete(subscriber);

      if (this.subscribers.size === 0) {
        window.cancelAnimationFrame(this.animationFrame);
      }
    };
  }
}

export const tempus = new Tempus();
