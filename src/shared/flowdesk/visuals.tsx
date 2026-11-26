import type { SVGProps } from 'react';

type SvgProps = SVGProps<SVGSVGElement>;

export function FlowDeskMark(props: SvgProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <rect width="32" height="32" rx="9" fill="currentColor" />
      <path
        d="M9 10.5h14M9 16h9M9 21.5h14"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
      <circle cx="22" cy="16" r="2.25" fill="white" />
    </svg>
  );
}

export function HeroRouteMap(props: SvgProps) {
  return (
    <svg viewBox="0 0 680 410" aria-hidden="true" {...props}>
      <defs>
        <marker
          id="fd-arrow"
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 8 4 0 8Z" fill="currentColor" />
        </marker>
      </defs>
      <path
        className="fd-route fd-route-soft"
        d="M94 84H218c54 0 44 74 102 74h46"
      />
      <path
        className="fd-route fd-route-soft"
        d="M94 178h124c54 0 44-20 102-20h46"
      />
      <path
        className="fd-route fd-route-soft"
        d="M94 272h124c54 0 44-114 102-114h46"
      />
      <path
        className="fd-route fd-route-active"
        d="M410 158h92c36 0 38-68 82-68h30"
        markerEnd="url(#fd-arrow)"
      />
      <path
        className="fd-route fd-route-active"
        d="M410 158h94c34 0 38 4 80 4h30"
        markerEnd="url(#fd-arrow)"
      />
      <path
        className="fd-route fd-route-active"
        d="M410 158h92c36 0 38 76 82 76h30"
        markerEnd="url(#fd-arrow)"
      />
      <circle className="fd-route-node" cx="388" cy="158" r="22" />
      <path
        d="m378 158 7 7 14-16"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
      <g className="fd-route-pulse">
        <circle cx="218" cy="84" r="4" />
        <circle cx="218" cy="178" r="4" />
        <circle cx="218" cy="272" r="4" />
      </g>
    </svg>
  );
}

export function ProblemDiagram(props: SvgProps) {
  return (
    <svg viewBox="0 0 560 250" aria-hidden="true" {...props}>
      <g className="fd-svg-muted" fill="none" stroke="currentColor">
        <rect x="8" y="18" width="164" height="48" rx="12" />
        <rect x="44" y="92" width="188" height="48" rx="12" />
        <rect x="18" y="166" width="142" height="48" rx="12" />
        <path d="M172 42h58M232 116h34M160 190h70" strokeDasharray="4 7" />
      </g>
      <path
        className="fd-svg-accent"
        d="M260 42c42 0 32 83 76 83M266 116h70M230 190c42 0 56-65 106-65"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <g className="fd-svg-ink">
        <rect
          x="336"
          y="66"
          width="216"
          height="118"
          rx="14"
          fill="currentColor"
        />
        <path
          d="M364 96h106M364 122h156M364 148h78"
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeWidth="8"
          opacity=".9"
        />
        <circle cx="512" cy="148" r="11" fill="#5d91ff" />
        <path
          d="m507 148 4 4 7-9"
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

export type WorkflowVisual = 'intake' | 'review' | 'list' | 'detail';

export function WorkflowGlyph({
  kind,
  ...props
}: SvgProps & { kind: WorkflowVisual }) {
  if (kind === 'intake') {
    return (
      <svg viewBox="0 0 120 76" aria-hidden="true" {...props}>
        <rect
          className="fd-glyph-frame"
          x="5"
          y="8"
          width="110"
          height="60"
          rx="10"
        />
        <path className="fd-glyph-line" d="M21 25h53M21 37h76M21 49h61" />
        <circle className="fd-glyph-dot" cx="98" cy="25" r="5" />
      </svg>
    );
  }
  if (kind === 'review') {
    return (
      <svg viewBox="0 0 120 76" aria-hidden="true" {...props}>
        <rect
          className="fd-glyph-frame"
          x="5"
          y="8"
          width="48"
          height="60"
          rx="9"
        />
        <rect
          className="fd-glyph-frame"
          x="61"
          y="8"
          width="54"
          height="60"
          rx="9"
        />
        <path
          className="fd-glyph-line"
          d="M17 25h24M17 37h19M73 25h30M73 37h22M73 49h28"
        />
        <path className="fd-glyph-accent" d="M42 50h31" />
      </svg>
    );
  }
  if (kind === 'list') {
    return (
      <svg viewBox="0 0 120 76" aria-hidden="true" {...props}>
        <path className="fd-glyph-line" d="M31 20h75M31 38h75M31 56h75" />
        <circle className="fd-glyph-dot" cx="16" cy="20" r="5" />
        <circle className="fd-glyph-dot" cx="16" cy="38" r="5" />
        <circle className="fd-glyph-dot" cx="16" cy="56" r="5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 76" aria-hidden="true" {...props}>
      <path
        className="fd-glyph-line"
        d="M22 16v44M22 22h22M22 40h44M22 58h72"
      />
      <circle className="fd-glyph-dot" cx="22" cy="22" r="6" />
      <circle className="fd-glyph-dot" cx="22" cy="40" r="6" />
      <circle className="fd-glyph-dot" cx="22" cy="58" r="6" />
    </svg>
  );
}

export type FeatureVisual =
  | 'context'
  | 'extract'
  | 'evidence'
  | 'match'
  | 'rules'
  | 'track';

export function FeatureDiagram({
  kind,
  ...props
}: SvgProps & { kind: FeatureVisual }) {
  const frame = (
    <rect
      className="fd-feature-frame"
      x="8"
      y="8"
      width="244"
      height="132"
      rx="14"
    />
  );
  if (kind === 'context') {
    return (
      <svg viewBox="0 0 260 148" aria-hidden="true" {...props}>
        {frame}
        <rect
          className="fd-feature-paper"
          x="28"
          y="30"
          width="76"
          height="82"
          rx="9"
        />
        <rect
          className="fd-feature-paper"
          x="156"
          y="30"
          width="76"
          height="82"
          rx="9"
        />
        <path
          className="fd-feature-stroke"
          d="M43 50h45M43 65h35M171 50h45M171 65h30"
        />
        <path className="fd-feature-accent" d="M106 71h47" />
        <circle className="fd-feature-node" cx="130" cy="71" r="13" />
      </svg>
    );
  }
  if (kind === 'extract') {
    return (
      <svg viewBox="0 0 260 148" aria-hidden="true" {...props}>
        {frame}
        <path className="fd-feature-stroke" d="M28 38h72M28 55h52M28 72h64" />
        <path className="fd-feature-accent" d="M108 54h34" />
        <rect
          className="fd-feature-paper"
          x="145"
          y="26"
          width="86"
          height="96"
          rx="10"
        />
        <path
          className="fd-feature-stroke"
          d="M160 47h56M160 66h38M160 85h48M160 104h28"
        />
      </svg>
    );
  }
  if (kind === 'evidence') {
    return (
      <svg viewBox="0 0 260 148" aria-hidden="true" {...props}>
        {frame}
        <path
          className="fd-feature-stroke"
          d="M30 39h116M30 59h82M30 79h132M30 99h96"
        />
        <path className="fd-feature-highlight" d="M30 75h132v12H30z" />
        <path className="fd-feature-accent" d="M170 81h38" />
        <circle className="fd-feature-node" cx="220" cy="81" r="11" />
      </svg>
    );
  }
  if (kind === 'match') {
    return (
      <svg viewBox="0 0 260 148" aria-hidden="true" {...props}>
        {frame}
        <circle className="fd-feature-node" cx="51" cy="74" r="18" />
        <circle className="fd-feature-node" cx="207" cy="43" r="14" />
        <circle className="fd-feature-node" cx="207" cy="103" r="14" />
        <path
          className="fd-feature-stroke"
          d="M70 74h47M117 74c29 0 31-31 72-31M117 74c29 0 31 29 72 29"
        />
        <path className="fd-feature-accent" d="M85 67l8 8 16-18" />
      </svg>
    );
  }
  if (kind === 'rules') {
    return (
      <svg viewBox="0 0 260 148" aria-hidden="true" {...props}>
        {frame}
        <rect
          className="fd-feature-paper"
          x="27"
          y="27"
          width="102"
          height="94"
          rx="10"
        />
        <path
          className="fd-feature-stroke"
          d="M27 51h102M49 27v18M105 27v18M47 72h15M76 72h15M105 72h8M47 94h15M76 94h15"
        />
        <circle className="fd-feature-node" cx="190" cy="74" r="30" />
        <path className="fd-feature-accent" d="M190 57v19l14 9" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 260 148" aria-hidden="true" {...props}>
      {frame}
      <path
        className="fd-feature-stroke"
        d="M46 27v94M46 45h66M46 74h108M46 104h158"
      />
      <circle className="fd-feature-node" cx="46" cy="45" r="10" />
      <circle className="fd-feature-node" cx="46" cy="74" r="10" />
      <circle className="fd-feature-node" cx="46" cy="104" r="10" />
      <path className="fd-feature-accent" d="m42 104 4 4 7-9" />
    </svg>
  );
}

export function TrustLedger(props: SvgProps) {
  return (
    <svg viewBox="0 0 500 240" aria-hidden="true" {...props}>
      <rect
        className="fd-ledger-sheet"
        x="8"
        y="8"
        width="484"
        height="224"
        rx="16"
      />
      <path className="fd-ledger-line" d="M38 56h424M38 112h424M38 168h424" />
      <circle className="fd-ledger-ai" cx="66" cy="84" r="13" />
      <circle className="fd-ledger-rule" cx="66" cy="140" r="13" />
      <circle className="fd-ledger-human" cx="66" cy="196" r="13" />
      <path
        className="fd-ledger-copy"
        d="M98 79h128M98 91h78M98 135h154M98 147h106M98 191h182M98 203h94"
      />
      <path className="fd-ledger-check" d="m415 191 10 10 22-27" />
    </svg>
  );
}
