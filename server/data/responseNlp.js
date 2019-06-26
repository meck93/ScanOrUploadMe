const response = [
  {
    mentions: [
      {
        text: { content: 'Moritz', beginOffset: -1 },
        type: 'PROPER',
        sentiment: null
      }
    ],
    metadata: {},
    name: 'Moritz',
    type: 'PERSON',
    salience: 0.5934920310974121,
    sentiment: null
  },
  {
    mentions: [
      {
        text: { content: 'birthday', beginOffset: -1 },
        type: 'COMMON',
        sentiment: null
      }
    ],
    metadata: {},
    name: 'birthday',
    type: 'EVENT',
    salience: 0.27293622493743896,
    sentiment: null
  },
  {
    mentions: [
      {
        text: { content: 'Thanks', beginOffset: -1 },
        type: 'COMMON',
        sentiment: null
      }
    ],
    metadata: {},
    name: 'Thanks',
    type: 'OTHER',
    salience: 0.09422965347766876,
    sentiment: null
  },
  {
    mentions: [
      {
        text: { content: 'Michael Moore', beginOffset: -1 },
        type: 'PROPER',
        sentiment: null
      }
    ],
    metadata: {
      mid: '/m/0jw67',
      wikipedia_url: 'https://en.wikipedia.org/wiki/Michael_Moore'
    },
    name: 'Michael Moore',
    type: 'PERSON',
    salience: 0.03934212028980255,
    sentiment: null
  }
];

const result2 = [
  { name: 'Moritz', type: 'PERSON', salience: 0.5934920310974121 },
  { name: 'birthday', type: 'EVENT', salience: 0.27293622493743896 },
  { name: 'Thanks', type: 'OTHER', salience: 0.09422965347766876 },
  { name: 'Michael Moore', type: 'PERSON', salience: 0.03934212028980255 }
];
