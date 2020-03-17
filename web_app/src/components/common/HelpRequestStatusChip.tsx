import React from "react";
import styled from "@emotion/styled";

import { HelpRequestStatus } from "../../firebase/storage/helpRequest";
import { PALETTE } from "../../styles/colors";
import { spacing } from "../../styles/spacing";

const StatusToColorMapping: { [key in HelpRequestStatus]: string } = {
  [HelpRequestStatus.ACTIVE]: PALETTE.error,
  [HelpRequestStatus.CLAIMED]: PALETTE.secondary,
  [HelpRequestStatus.RESOLVED]: PALETTE.complimentary
};

const Chip = styled.div<{ status: HelpRequestStatus }>`
  border: 1px solid ${({ status }) => StatusToColorMapping[status]};
  border-radius: 8px;
  padding: ${spacing.xs};
  color: ${({ status }) => StatusToColorMapping[status]};
`;

const StatusToTextMapping: { [key in HelpRequestStatus]: string } = {
  [HelpRequestStatus.ACTIVE]: "Looking for help",
  [HelpRequestStatus.CLAIMED]: "Being helped",
  [HelpRequestStatus.RESOLVED]: "Resolved"
};

export const HelpRequestStatusChip: React.FC<{ status: HelpRequestStatus }> = ({
  status
}) => {
  return <Chip status={status}>{StatusToTextMapping[status]}</Chip>;
};
