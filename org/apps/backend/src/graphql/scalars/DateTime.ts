import { scalarType } from 'nexus'

export const DateTime = scalarType({
  name: "DateTime",
  asNexusMethod: "dateTime",
  parseValue(value) {
    return new Date(value as string);
  },
  serialize(value) {
    return (value as Date).toISOString();
  },
});
