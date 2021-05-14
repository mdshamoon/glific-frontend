import { GET_CONSULTING_HOURS, GET_CONSULTING_HOURS_COUNT } from '../graphql/queries/Consulting';

const mockListDummyData = new Array(10).fill(null).map((val: any, index: number) => ({
  id: `${index}`,
  content: 'Testing',
  isBillable: index % 2 === 0,
  duration: 30,
  insertedAt: '2021-05-13T05:17:31Z',
  participants: 'John Doe',
  staff: `Glific${index}`,
  organizationName: 'Foogle',
  updatedAt: '2021-05-13T05:35:51Z',
  when: '2021-05-06T10:30:00Z',
}));

export const listingMock = [
  {
    request: {
      query: GET_CONSULTING_HOURS_COUNT,
      variables: { filter: {} },
    },
    result: {
      data: {
        countConsultingHours: 10,
      },
    },
  },
  {
    request: {
      query: GET_CONSULTING_HOURS,
      variables: {
        filter: {},
        opts: {
          limit: 50,
          offset: 0,
          order: 'ASC',
          orderWith: 'organization_name',
        },
      },
    },
    result: {
      data: {
        consultingHours: mockListDummyData,
      },
    },
  },
];
