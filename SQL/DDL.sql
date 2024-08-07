CREATE TABLE public.account (
	provider VARCHAR NOT NULL,
	provideraccountid VARCHAR NOT NULL,
	CONSTRAINT account_unique UNIQUE (provider, provideraccountid)
);