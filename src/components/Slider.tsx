function track(isFill = false) {
  return `
    box-sizing: border-box;
    border: none;
    width: 100%;
    min-width: var(--track-w);
    height: var(--track-h);
    background: var(--track-c);
    ${
      isFill
        ? `
      background: linear-gradient(var(--fill-c), var(--fill-c))
                  0/ var(--sx) 100% no-repeat var(--track-c)
    `
        : ''
    }
  `
}

function fill() {
  return `
    height: var(--track-h);
    background: var(--fill-c)
  `
}

function thumb() {
  return `
    box-sizing: border-box;
    border: none;
    width: var(--thumb-d); height: var(--thumb-d);
    border-radius: 50%;
    background: white;
    transition: 0.2s ease-in-out;
    &:hover {
      width: 20px;
      height: 20px;
    }
  `
}

type SliderProps = {
  min?: number
  max?: number
  step?: number
  value?: number
  onChange: (n: number) => void
}

export default function Slider({ min = 0, max = 1, value = 0, step = 0.01, onChange }: SliderProps) {
  return (
    <>
      <style>{`
        :root {
          --track-w: 12em;
          --track-h: .25em;
          --thumb-d: 1em;
          --track-c: #ccc;
          --fill-c: white;
          
          --min: ${min};
          --max: ${max};
          --val: ${value}; 
        }

        input[type="range"] {
          &, &::-webkit-slider-thumb {
            -webkit-appearance: none;
          }
          
          --range: calc(var(--max) - var(--min));
          --ratio: calc((var(--val) - var(--min)) / var(--range));
          --sx: calc(.5 * var(--thumb-d) + var(--ratio) * (100% - var(--thumb-d)));
          margin: 0;
          padding: 0;
          // width: var(--track-w);
          // min-width: var(--track-w);
          height: var(--thumb-d);
          background: transparent;
          font: 1em/1 arial, sans-serif;
          cursor: pointer;
        }

        input[type="range"]::-moz-focus-outer {
          border: none;
        }
        
        input[type="range"]::-webkit-slider-runnable-track {
          ${track(true)}
        }

        input[type="range"]::-moz-range-track { ${track()} }
        input[type="range"]::-ms-track { ${track()} }
        
        input[type="range"]::-moz-range-progress { ${fill()} }
        input[type="range"]::-ms-fill-lower { ${fill()} }
        
        input[type="range"]::-webkit-slider-thumb {
          margin-top: calc(.5 * (var(--track-h) - var(--thumb-d)));
          ${thumb()}
        }

        input[type="range"]::-moz-range-thumb { ${thumb()} }
        input[type="range"]::-ms-thumb {
          margin-top: 0;
          ${thumb()}
        }
        
        input[type="range"]::-ms-tooltip { display: none }
      `}</style>
      <input
        type='range'
        className='absolute -top-2 inset-x-0 z-20 w-full'
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(ev) => onChange((ev.target as HTMLInputElement).valueAsNumber)}
      />
    </>
  )
}
