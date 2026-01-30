import { config } from 'dotenv';

import * as joi from 'joi';

import { resolve } from 'node:path';

import { ExecModes } from '@common/enums';

const nodeEnv = (process.env.NODE_ENV?.trim() as ExecModes) || ExecModes.LOCAL;

const envFile = nodeEnv === ExecModes.PROD ? '.env' : `.env.${nodeEnv}`;

const envPath = resolve(process.cwd(), envFile);

config({ path: envPath });

interface EnvVars {
  PORT: number;
  NODE_ENV: ExecModes;
}

const envSchema = joi
  .object({
    PORT: joi.number().default(3000),
    NODE_ENV: joi
      .string()
      .valid(...Object.values(ExecModes))
      .default(ExecModes.LOCAL),
  })
  .unknown(true);

const result = envSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: false,
});

const error = result.error;
const value = result.value as EnvVars;

if (error) {
  throw new Error(`Config validation error: \n ${error.message} in ${envFile}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  nodeEnv,
};
