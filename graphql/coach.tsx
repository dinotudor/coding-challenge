import { gql } from "apollo-server-micro";

export default gql`
query Query($where: CoachWhereUniqueInput!) {
  coach(where: $where) {
    name
    email
  }
}
`;
