import compose from 'compose-function';
//import { compose } from "@reduxjs/toolkit";
import { withRouter } from "./with-router";
import { withStore } from "./with-store";
import { withQuery } from './with-query';

export const withProviders = compose( withRouter, withStore, withQuery );