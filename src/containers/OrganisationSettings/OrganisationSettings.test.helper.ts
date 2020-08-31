import { GET_AUTOMATIONS } from '../../graphql/queries/Automation';
import { GET_ORGANIZATION } from '../../graphql/queries/Organization';
import { GET_LANGUAGES } from '../../graphql/queries/List';

export const LIST_ITEM_MOCKS = [
  {
    request: {
      query: GET_LANGUAGES,
    },
    result: {
      data: {
        languages: [
          {
            id: '1',
            label: 'English (United States)',
          },
          {
            id: '2',
            label: 'Hindi (India)',
          },
        ],
      },
    },
  },
  {
    request: {
      query: GET_AUTOMATIONS,
      variables: {},
    },
    result: {
      data: {
        flows: [
          {
            __typename: 'Flow',
            id: '1',
            name: 'Help Workflow',
            shortcode: 'help',
            uuid: '3fa22108-f464-41e5-81d9-d8a298854429',
          },
          {
            __typename: 'Flow',
            id: '10',
            name: 'SoL Feedback',
            shortcode: 'solfeedback',
            uuid: '6c21af89-d7de-49ac-9848-c9febbf737a5',
          },
        ],
      },
    },
  },
  {
    request: {
      query: GET_ORGANIZATION,
      variables: { id: 1 },
    },
    result: {
      data: {
        organization: {
          __typename: 'OrganizationResult',
          organization: {
            __typename: 'Organization',
            defaultLanguage: { __typename: 'Language', id: '2', label: 'English (United States)' },
            id: '1',
            name: 'Glific',
            outOfOffice: {
              __typename: 'OutOfOffice',
              enabled: true,
              enabledDays: [
                { __typename: 'EnabledDay', enabled: false, id: 1 },
                { __typename: 'EnabledDay', enabled: false, id: 2 },
                { __typename: 'EnabledDay', enabled: false, id: 3 },
                { __typename: 'EnabledDay', enabled: false, id: 4 },
                { __typename: 'EnabledDay', enabled: true, id: 5 },
                { __typename: 'EnabledDay', enabled: true, id: 6 },
                { __typename: 'EnabledDay', enabled: false, id: 7 },
              ],
              endTime: '20:00:00',
              flowId: '6',
              startTime: '10:00:00',
            },
            provider: {
              __typename: 'Provider',
              apiEndPoint: 'https://api.gupshup.io/sm/api/v1',
              id: '1',
              name: 'Gupshup',
              url: 'https://gupshup.io/',
            },
            providerKey: 'key',
            providerNumber: '9897899878979',
          },
        },
      },
    },
  },
  ,
];