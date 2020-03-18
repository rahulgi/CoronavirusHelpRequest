import React from "react";
import styled from "@emotion/styled/macro";

import { DefaultLayout } from "../common/DefaultLayout";
import { PALETTE } from "../../styles/colors";
import { HelpRequestStatusChip } from "../common/HelpRequestStatusChip";
import { HelpRequestStatus } from "../../firebase/storage/helpRequest";
import { Card, CardBody, CardBodyText } from "../common/Material/Card";
import { spacing } from "../../styles/spacing";

const HelpRequest = styled.span`
  color: ${PALETTE.error};
`;

const HelpOffer = styled.span`
  color: ${PALETTE.complimentary};
`;

const Warning = styled.span`
  color: ${PALETTE.error};
`;

const Section = styled.section`
  & > *:not(:last-child) {
    margin-bottom: ${spacing.m};
  }
`;

export const AboutPage: React.FC = () => {
  return (
    <DefaultLayout pageTitle="FAQ">
      <Section>
        <h5>What is this?</h5>
        <p>
          <b>Coronavirus Help Requests</b> was built to help people within
          communities help each other in the face of the Covid19 (Coronavirus)
          Pandemic.
        </p>
        <Card>
          <CardBody>
            <CardBodyText>
              <Warning>
                This site is not intended to solve urgent health-related
                requests. If you're having an emergency, please contact 911 (or
                your local equivalent).
              </Warning>
            </CardBodyText>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <CardBodyText>
              <Warning>
                If you suspect you have the Coronavirus, please contact your
                doctor, and review the resources posted by the{" "}
                <a
                  href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  World Health Organization
                </a>
                .
              </Warning>
            </CardBodyText>
          </CardBody>
        </Card>
        <p>
          Covid19 appears to hit the elderly especially hard, and there are many
          people in our communities who are otherwise already especially
          vulnerable to respiratory illnesses.
        </p>
        <p>
          Volunteers who help with tasks like delivering groceries or picking up
          prescriptions can help reduce the risk and exposure to these
          vulnerable populations. <b>Coronavirus Help Requests</b> aims to
          connect people in need to those who can help.
        </p>
      </Section>
      <Section>
        <h5>How does it work?</h5>
        <p>
          Vulnerable community members post{" "}
          <HelpRequest>Help Requests</HelpRequest> with their general location
          and what they need.
        </p>
        <p>
          Healthy community members post <HelpOffer>Help Offers</HelpOffer> with
          their location and the distance they can travel. Anyone who has posted
          a <HelpOffer>Help Offer</HelpOffer> will also get notified when a new{" "}
          <HelpRequest>Help Request</HelpRequest> is made within the range of
          their offer.
        </p>
        <p>
          If you're looking to volunteer, you can send messages to the creator
          of <HelpRequest>Help Requests</HelpRequest> to coordinate completing
          their request.
        </p>
        <p>
          If you need help, you can send a message reaching out to anyone who's
          created a <HelpOffer>Help Offer</HelpOffer> near you.
        </p>
        <p>
          When a <HelpRequest>Help Request</HelpRequest> is completed, the
          requester marks it as{" "}
          <HelpRequestStatusChip status={HelpRequestStatus.RESOLVED} /> to
          indicate that they no longer need help with that request.
        </p>
      </Section>
      <Section>
        <h5>Who built this?</h5>
        <p>
          <b>Coronavirus Help Requests</b> was built as a community service by{" "}
          <a
            href="https://rahulgi.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rahul Gupta-Iwasaki
          </a>
          . He currently works at{" "}
          <a href="https://every.org" target="_blank" rel="noopener noreferrer">
            Every.org
          </a>{" "}
          and lives in San Francisco. If you have any
          questions/comments/concerns about this site, please email him at
          rahul.guptaiwasaki(at)gmail.com.
        </p>
      </Section>
    </DefaultLayout>
  );
};
