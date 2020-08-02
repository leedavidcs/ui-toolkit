import { DecoratorFunction } from "@storybook/addons";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { ReactElement } from "react";

// Using publishable stripe key for demo
const stripePublishable: string = "pk_test_dJ9FeBRrYMhKtLqZg95Mtzcf00VjxDkuRK";
const stripePromise = loadStripe(stripePublishable);

export const withStripe: DecoratorFunction<ReactElement> = (getStory) => {
	return <Elements stripe={stripePromise}>{getStory()}</Elements>;
};
