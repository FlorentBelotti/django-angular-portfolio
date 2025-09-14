import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-typing-text',
  templateUrl: './typing-text.component.html',
  styleUrls: ['./typing-text.component.css']
})
export class TypingTextComponent implements AfterViewInit {
  private resolver = {
    resolve: (options: any, callback: () => void) => {
      const resolveString = options.resolveString || options.element.getAttribute('data-target-resolver');
      const combinedOptions = { ...options, resolveString };

      const getRandomInteger = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
      const randomCharacter = (characters: string[]) => characters[getRandomInteger(0, characters.length - 1)];

      const doRandomiserEffect = (opts: any, cb: () => void) => {
        const { characters, timeout, element, partialString, iterations } = opts;

        setTimeout(() => {
          if (iterations >= 0) {
            const nextOptions = { ...opts, iterations: iterations - 1 };

            if (iterations === 0) {
              element.textContent = partialString;
            } else {
              element.textContent = partialString.substring(0, partialString.length - 1) + randomCharacter(characters);
            }

            doRandomiserEffect(nextOptions, cb);
          } else if (typeof cb === 'function') {
            cb();
          }
        }, timeout);
      };

      const doResolverEffect = (opts: any, cb: () => void) => {
        const { resolveString, offset, characters } = opts;
        const partialString = resolveString.substring(0, offset);
        const combinedOpts = { ...opts, partialString };

        doRandomiserEffect(combinedOpts, () => {
          const nextOptions = { ...opts, offset: offset + 1 };

          if (offset <= resolveString.length) {
            doResolverEffect(nextOptions, cb);
          } else if (typeof cb === 'function') {
            cb();
          }
        });
      };

      doResolverEffect(combinedOptions, callback);
    }
  };

  ngAfterViewInit(): void {
    const element = document.querySelector('[data-target-resolver]');
    const text = 'What cruel IRONY it is /\nThat we can CHOOSE /\nTo CONTROL our THOUGHTS /\nBut not our FEELINGS /'; // Added line breaks

    const options = {
      offset: 0,
      timeout: 20, // Reduced timeout for faster animation
      iterations: 5, // Reduced iterations for quicker resolution
      characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'.split(''),
      resolveString: text,
      element
    };

    this.resolver.resolve(options, () => {});
  }
}
