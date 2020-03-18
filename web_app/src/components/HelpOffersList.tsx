import React, { useState, useMemo } from "react";

import { HelpOfferCard } from "./common/HelpOfferCard";
import { List } from "./common/List";
import { FetchResultStatus } from "../hooks/data";
import { Loading } from "./common/Loading";
import { Error } from "./common/Error";
import { HelpOffersResult } from "../hooks/data/useHelpOffers";

export const HelpOffersList: React.FC<{
  helpOffersResult: HelpOffersResult;
}> = ({ helpOffersResult }) => {
  return (
    <div>
      <List>
        {helpOffersResult.status === FetchResultStatus.LOADING && <Loading />}
        {helpOffersResult.status === FetchResultStatus.ERROR && (
          <Error>{helpOffersResult.error}</Error>
        )}
        {helpOffersResult.status === FetchResultStatus.FOUND &&
          helpOffersResult.result.map(offer => (
            <li key={offer.id}>
              <HelpOfferCard offer={offer} isLink showMessageButton />
            </li>
          ))}
      </List>
    </div>
  );
};
