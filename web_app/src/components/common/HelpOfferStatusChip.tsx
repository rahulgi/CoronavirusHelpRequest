import styled from "@emotion/styled/macro";
import { PALETTE } from "../../styles/colors";
import { spacing } from "../../styles/spacing";

export const HelpOfferStatusChip = styled.div`
  display: inline-flex;
  border: 1px solid ${PALETTE.complimentary};
  border-radius: 8px;
  padding: ${spacing.xs};
  color: ${PALETTE.complimentary};
  &::after {
    content: "Offering help";
  }
`;
