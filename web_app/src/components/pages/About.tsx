import React from "react";
import styled from "@emotion/styled/macro";

import { DefaultLayout } from "../common/DefaultLayout";
import { PALETTE } from "../../styles/colors";
import { HelpRequestStatusChip } from "../common/HelpRequestStatusChip";
import { HelpRequestStatus } from "../../firebase/storage/helpRequest";
import { Card, CardBody, CardBodyText } from "../common/Material/Card";

const HelpRequest = styled.span`
  color: ${PALETTE.error};
`;

const HelpOffer = styled.span`
  color: ${PALETTE.complimentary};
`;

const Warning = styled.span`
  color: ${PALETTE.error};
`;

export const AboutPage: React.FC = () => {
  return (
    <DefaultLayout pageTitle="About">
      <h5>What is it?</h5>
      <p>
        <b>Coronavirus Help Requests</b> was built to help people within
        communities help each other in the face of the Covid19 (Coronavirus)
        Pandemic.
      </p>
      <Card>
        <CardBody>
          <CardBodyText>
            <Warning>
              This site is not intended to solve urgent health-related requests.
              If you're having an emergency, please contact 911 (or your local
              equivalent).
            </Warning>
          </CardBodyText>
        </CardBody>
      </Card>
      <h5>How does it work?</h5>
      <p>
        Vulnerable community members post{" "}
        <HelpRequest>Help Requests</HelpRequest> with their general location and
        what they need.{" "}
      </p>
      <p>
        Healthy community members post <HelpOffer>Help Offers</HelpOffer> with
        their location and the distance they can travel. Anyone who has posted a{" "}
        <HelpOffer>Help Offer</HelpOffer> will also get notified when a new{" "}
        <HelpRequest>Help Request</HelpRequest> is made within the range of
        their offer.
      </p>
      <p>
        Helpers can send messages to the creator of{" "}
        <HelpRequest>Help Requests</HelpRequest> to figure out any details they
        need to complete the request.
      </p>
      <p>
        When a <HelpRequest>Help Request</HelpRequest> is completed, the
        requester marks it as{" "}
        <HelpRequestStatusChip status={HelpRequestStatus.RESOLVED} /> to
        indicate that they no longer need help with that request.
      </p>
      <h5>Who built this?</h5>
      <p>
        <b>Coronavirus Help Requests</b> was built by{" "}
        <a href="https://rahulgi.com" target="_blank">
          Rahul Gupta-Iwasaki
        </a>
        . He currently works as the Head of Product at{" "}
        <a href="https://every.org" target="_blank">
          Every.org
        </a>{" "}
        and lives in San Francisco. If you have any questions/comments/concerns
        about this site, please email him at rahul.guptaiwasaki(at)gmail.com.
      </p>
    </DefaultLayout>
  );
};
