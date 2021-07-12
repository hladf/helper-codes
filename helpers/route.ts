import { useLocation } from 'react-router-dom';

import {
  ProposalRoutes,
  ProposalRoutesWithParams,
  AccountRoutes,
  SchedulingRoutes,
} from 'modules';

import { isWindowSupported } from 'helpers';
import {
  AuthSessionTypes,
  AuthSessionTypesEnum,
  BeneficiariesSummary,
  BeneficiaryTypeEnum,
  ProposalSegmentType,
  ResetPasswordRouteParamEnum,
  UserTypes,
  BeneficiariesLoginEnum,
  ProposalStatusEnum,
  BeneficiaryProposalInfo,
} from 'interfaces';
import store from 'store/index';

/** Exemplo de uso: `const id = query.get('id');` */
export function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}

interface Params {
  [key: string]: string | number | undefined;
}

export function putQueryParams(route: string, params?: Params | false) {
  if (!params) return route;
  const paramValueIsValid = (key?: string) =>
    !!key && params[key] !== undefined && params[key] !== '';

  const queryString = Object.keys(params)
    .map((key) => paramValueIsValid(key) && `${key}=${params[key]}`)
    .filter((item) => item !== undefined && item !== false)
    .join('&');
  return route + '?' + queryString;
}

/** Substitui o prefixo da rota de `PME` baseado no `segmento` */
export function replaceRoutePrefixBySegment(
  /** Rota que PRECISA ser `pme/` para que o replace funcione */
  route: string,
  segment: ProposalSegmentType
) {
  const routesPrefix = {
    [ProposalSegmentType.PME]: 'pme/',
    [ProposalSegmentType.MEMBERSHIP]: 'membership/',
    [ProposalSegmentType.INDIVIDUAL]: 'individual/',
  };
  return route.replace('pme/', routesPrefix[segment]);
}

const getBeneficiaryDocumentationURL = (
  segment: ProposalSegmentType,
  proposalID: string,
  hasSummaryData: boolean
): string => {
  if (segment === ProposalSegmentType.INDIVIDUAL) {
    return ProposalRoutesWithParams.IndividualBeneficiariesDocumentation(proposalID);
  }

  return hasSummaryData
    ? ProposalRoutesWithParams.BeneficiariesDocSummary(proposalID)
    : ProposalRoutesWithParams.BeneficiariesNew(proposalID);
};

export function getProposalBeneficiariesRoutes(
  proposalId: string,
  segment: ProposalSegmentType,
  hasSummaryData: boolean
): BeneficiariesSummary['urls'] {
  const routes = {
    urlToBeneficiaries: hasSummaryData
      ? ProposalRoutesWithParams.BeneficiariesSummary(proposalId)
      : ProposalRoutesWithParams.BeneficiariesNew(proposalId),
    urlToBeneficiariesDocumentation: getBeneficiaryDocumentationURL(
      segment,
      proposalId,
      hasSummaryData
    ),
  };

  return {
    urlToBeneficiaries: replaceRoutePrefixBySegment(
      routes.urlToBeneficiaries,
      segment
    ),
    urlToBeneficiariesDocumentation: replaceRoutePrefixBySegment(
      routes.urlToBeneficiariesDocumentation,
      segment
    ),
  };
}

export function getBrokerBaseApiRouteBySegment(
  proposalId: string | number,
  segment: ProposalSegmentType,
  requestType: 'GET' | 'POST' | 'PUT'
): string {
  if (requestType === 'PUT' || requestType === 'GET') {
    return {
      [ProposalSegmentType.PME]: `/proposal/${proposalId}/pme/broker`,
      [ProposalSegmentType.MEMBERSHIP]: `/proposal/${proposalId}/personal/broker`,
      [ProposalSegmentType.INDIVIDUAL]: `/proposal/${proposalId}/individual/broker`,
    }[segment];
  }

  // POST
  return {
    [ProposalSegmentType.PME]: '/proposal/pme/broker',
    [ProposalSegmentType.MEMBERSHIP]: '/proposal/personal/broker',
    [ProposalSegmentType.INDIVIDUAL]: '/proposal/individual/broker',
  }[segment];
}

export const getLoginRouteBySessionType = (
  sessionType: AuthSessionTypes
): string => {
  if (!isWindowSupported()) {
    return '/';
  }

  const { pathname } = window?.location;
  const userData = store.getState().user.data;

  const isBackoffice = pathname.includes('backoffice');

  const isBeneficiary = sessionType === 'beneficiary';

  const loginRoutes = {
    [AuthSessionTypesEnum.PortalQ]: AccountRoutes.Login,
    [AuthSessionTypesEnum.Backoffice]: AccountRoutes.LoginBackoffice,
    [AuthSessionTypesEnum.Medical]: AccountRoutes.LoginMedical,
    [AuthSessionTypesEnum.MedicalAssistant]: AccountRoutes.LoginMedical,
  };

  const allLoginRoutes = [
    AccountRoutes.Login,
    AccountRoutes.LoginBackoffice,
    AccountRoutes.LoginBeneficiaries,
    AccountRoutes.LoginDPS,
    AccountRoutes.LoginMedical,
    AccountRoutes.LoginScheduling,
    AccountRoutes.UnifiedLogin,
  ];
  const currentlyRouteIsLogin = allLoginRoutes.includes(pathname);

  /** se a rota atual for de login, irá retornar a própria rota */
  if (currentlyRouteIsLogin) {
    return pathname;
  }

  /** caso a sessão atual seja beneficiário, irá identificar o tipo de login (BeneficiariesLoginEnum) pela sessão */
  if (isBeneficiary && userData) {
    return AccountRoutes.UnifiedLogin;
  }

  /* this url is hardcoded because dont have a index modules routes file */
  if (isBackoffice) {
    return '/backoffice';
  }

  return loginRoutes[sessionType] || AccountRoutes.Login;
};

export function getLoginRouteByLoginBeneficiaryStep(step: BeneficiariesLoginEnum) {
  const LoginBeneficiariesRoutes = {
    [BeneficiariesLoginEnum.dps]: AccountRoutes.LoginDPS,
    [BeneficiariesLoginEnum.contract]: AccountRoutes.LoginBeneficiaries,
    [BeneficiariesLoginEnum.scheduling]: AccountRoutes.LoginScheduling,
  };
  return LoginBeneficiariesRoutes[step];
}

export function getLoginRouteByUserType(userType: UserTypes) {
  const loginRoutes = {
    [UserTypes.SystemAdmin]: AccountRoutes.LoginBackoffice,
    [UserTypes.Backoffice]: AccountRoutes.LoginBackoffice,
    [UserTypes.Administrator]: AccountRoutes.Login,
    [UserTypes.Seller]: AccountRoutes.Login,
    [UserTypes.Broker]: AccountRoutes.Login,
    [UserTypes.Medic]: AccountRoutes.LoginMedical,
    [UserTypes.MedicalAssistant]: AccountRoutes.LoginMedical,
    [UserTypes.Implantation]: AccountRoutes.Login,
  };

  return loginRoutes[userType];
}

/**
 * in the future this function may have changes and maybe be more useful, so for prevention it is already created */
export function getLoginRouteByBeneficiaryType(
  beneficiaryType: BeneficiaryTypeEnum
) {
  const loginRoutes = {
    [BeneficiaryTypeEnum.Titular]: AccountRoutes.LoginDPS,
    [BeneficiaryTypeEnum.Dependent]: AccountRoutes.LoginDPS,
    [BeneficiaryTypeEnum.ResponsibleLegal]: AccountRoutes.LoginDPS,
    [BeneficiaryTypeEnum.ResponsibleFinancial]: AccountRoutes.LoginDPS,
    [BeneficiaryTypeEnum.Company]: AccountRoutes.LoginDPS,
    [BeneficiaryTypeEnum.Seller]: AccountRoutes.LoginDPS,
  };

  return loginRoutes[beneficiaryType];
}

export function getHomeRouteBySessionType(sessionType: AuthSessionTypes) {
  const homeRoutes = {
    portalq: '/',
    backoffice: '/backoffice',
    // como beneficiario não tem um Home, foi usado esse valor para não redirecionar
    beneficiary: window.location.pathname,
    medical: ProposalRoutes.DpsRectificationGrid,
    medical_assistant: ProposalRoutes.DpsRectificationGrid,
  };

  return homeRoutes[sessionType];
}

/* get session routes */
export function getSessionRouteBySessionType(sessionType: AuthSessionTypes) {
  const sessionRoutes = {
    [AuthSessionTypesEnum.Beneficiary]: '/beneficiary/session',
    [AuthSessionTypesEnum.Medical || UserTypes.Medic]: '/sessions/medical',
    [AuthSessionTypesEnum.MedicalAssistant]: '/sessions/medical',
    [AuthSessionTypesEnum.PortalQ]: '/sessions',
    [AuthSessionTypesEnum.Backoffice]: '/sessions',
  };
  return sessionRoutes[sessionType];
}

export function getSessionRouteByUserType(userType: UserTypes) {
  const sessionRoutes = {
    [UserTypes.SystemAdmin]: '/sessions',
    [UserTypes.Backoffice]: '/sessions',
    [UserTypes.Administrator]: '/sessions',
    [UserTypes.Seller]: '/sessions',
    [UserTypes.Broker]: '/sessions',
    [UserTypes.Medic]: '/sessions/medical',
    [UserTypes.MedicalAssistant]: '/sessions/medical',
    [UserTypes.Implantation]: '/sessions',
  };
  return sessionRoutes[userType];
}

export function getLoginResetPasswordByEnum(
  routeParam: ResetPasswordRouteParamEnum
) {
  const loginRoutes = {
    [ResetPasswordRouteParamEnum.contract]: AccountRoutes.LoginBeneficiaries,
    [ResetPasswordRouteParamEnum.dps]: AccountRoutes.LoginDPS,
  };

  return loginRoutes[routeParam];
}

export function resetPasswordTransformRouteToEnum(param: string) {
  const loginRoutes = {
    [AccountRoutes.LoginDPS]: BeneficiariesLoginEnum.dps,
    [AccountRoutes.LoginBeneficiaries]: BeneficiariesLoginEnum.contract,
    [AccountRoutes.LoginScheduling]: BeneficiariesLoginEnum.scheduling,
  };

  return loginRoutes[param];
}

export function getSessionTypeByUserType(userType: UserTypes) {
  const sessionRoutes = {
    [UserTypes.SystemAdmin]: AuthSessionTypesEnum.PortalQ,
    [UserTypes.Backoffice]: AuthSessionTypesEnum.Backoffice,
    [UserTypes.Administrator]: AuthSessionTypesEnum.PortalQ,
    [UserTypes.Seller]: AuthSessionTypesEnum.PortalQ,
    [UserTypes.Broker]: AuthSessionTypesEnum.PortalQ,
    [UserTypes.Medic]: AuthSessionTypesEnum.Medical,
    [UserTypes.MedicalAssistant]: AuthSessionTypesEnum.Medical,
    [UserTypes.Implantation]: AuthSessionTypesEnum.PortalQ,
  };
  return sessionRoutes[userType];
}

export function isLoginRoute() {
  if (isWindowSupported()) {
    const { pathname } = window.location;
    const loginRoutes = [
      AccountRoutes.Login,
      AccountRoutes.LoginBackoffice,
      AccountRoutes.LoginMedical,
      AccountRoutes.LoginDPS,
      AccountRoutes.LoginBeneficiaries,
      AccountRoutes.LoginScheduling,
    ];
    return loginRoutes.includes(pathname);
  }
  return false;
}

export function getBeneficiaryDpsRoute(proposal: BeneficiaryProposalInfo) {
  const dpsIsSigned = !!proposal.dpsSigned;
  const proposalIsIndividual = proposal.segment === ProposalSegmentType.INDIVIDUAL;
  const statusIsRectifiedOrAbove =
    (proposal.status || 0) >= ProposalStatusEnum.RectifiedDPS;

  const routeIfDpsRectified =
    statusIsRectifiedOrAbove && ProposalRoutes.DpsRectifiedView;

  const routeIfDpsSigned = dpsIsSigned && ProposalRoutes.DPSQuestionary;

  const routeIfProposalIsIndividual = proposalIsIndividual
    ? ProposalRoutes.QuestionaryExplanation
    : ProposalRoutes.ANSLetter;

  return routeIfDpsRectified || routeIfDpsSigned || routeIfProposalIsIndividual;
}

export function getBeneficiaryRouteByProposalStatus(
  proposal: BeneficiaryProposalInfo
): string | undefined {
  const routesByStatus = {
    [ProposalStatusEnum.PendingDPS]: getBeneficiaryDpsRoute(proposal),
    [ProposalStatusEnum.RectifiedDPS]: getBeneficiaryDpsRoute(proposal),
    [ProposalStatusEnum.PendingScheduling]: SchedulingRoutes.Summary,
    [ProposalStatusEnum.CreatedSchedule]: SchedulingRoutes.Summary,
    [ProposalStatusEnum.PendingSubscription]:
      ProposalRoutes.ContractPaymentInformation,
    [ProposalStatusEnum.PendingDocument]: ProposalRoutes.PendingDocumentsPage,
  };

  return routesByStatus[proposal.status];
}
