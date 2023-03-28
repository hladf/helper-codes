import axios from 'axios';
import { IOption } from 'components';
import { ebanxApiEnv, ebanxApiIntegrationKey } from 'config';
import {
  CreditCardTokenResponse,
  CreditCardType,
  EbanxApiEnv,
  GetCreditCardTokenParams,
} from 'interfaces';

export function getCardType(cardNumber: string): null | CreditCardType {
  const validationRules = [
    // AMEX
    { rule: new RegExp('^3[47]'), type: CreditCardType.Amex },
    // Discover
    {
      rule: new RegExp(
        '^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)'
      ),
      type: CreditCardType.Discover,
    },
    // Diners
    { rule: new RegExp('^36'), type: CreditCardType.Diners },
    // Diners - Carte Blanche
    { rule: new RegExp('^30[0-5]'), type: CreditCardType.Diners },
    // Visa Electron
    {
      rule: new RegExp('^(4026|417500|4508|4844|491(3|7))'),
      type: CreditCardType.Visa,
    },
    // Visa
    { rule: new RegExp('^4'), type: CreditCardType.Visa },
    // Mastercard
    // Updated for Mastercard 2017 BINs expansion
    {
      rule: new RegExp(
        /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/
      ),
      type: CreditCardType.Mastercard,
    },
  ];

  return validationRules.reduce<null | CreditCardType>(
    (validatedType, { rule, type }) => {
      if (!validatedType && rule.test(cardNumber)) {
        validatedType = type;
      }
      return validatedType;
    },
    null
  );
}

export const getCreditCardToken = async (
  params: GetCreditCardTokenParams
): Promise<CreditCardTokenResponse | undefined> => {
  try {
    const urlApi = {
      [EbanxApiEnv.Develop]: 'https://staging.ebanx.com.br/ws/token',
      [EbanxApiEnv.Production]: 'https://api.ebanx.com.br/ws/token',
    };

    const apiParams = {
      integration_key: ebanxApiIntegrationKey,
      payment_type_code: params.cardType,
      country: 'br',
      creditcard: {
        card_number: params.cardNumber,
        card_name: params.cardName,
        card_due_date: params.cardDueDate,
        card_cvv: params.cardCvv,
      },
    };

    const { data } = await axios.post<CreditCardTokenResponse>(
      urlApi[ebanxApiEnv],
      apiParams,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return data;
  } catch (_error) {
    return undefined;
  }
};

export const banksOptionList: IOption[] = [
  {
    value: '001',
    label: '001 - Banco do Brasil',
  },
  {
    value: '003',
    label: '003 - Banco da Amazônia',
  },
  {
    value: '004',
    label: '004 - Banco do Nordeste',
  },
  {
    value: '021',
    label: '021 - Banestes',
  },
  {
    value: '025',
    label: '025 - Banco Alfa',
  },
  {
    value: '027',
    label: '027 - Besc',
  },
  {
    value: '029',
    label: '029 - Banerj',
  },
  {
    value: '031',
    label: '031 - Banco Beg',
  },
  {
    value: '033',
    label: '033 - Banco Santander Banespa',
  },
  {
    value: '036',
    label: '036 - Banco Bem',
  },
  {
    value: '037',
    label: '037 - Banpará',
  },
  {
    value: '038',
    label: '038 - Banestado',
  },
  {
    value: '039',
    label: '039 - BEP',
  },
  {
    value: '040',
    label: '040 - Banco Cargill',
  },
  {
    value: '041',
    label: '041 - Banrisul',
  },
  {
    value: '044',
    label: '044 - BVA',
  },
  {
    value: '045',
    label: '045 - Banco Opportunity',
  },
  {
    value: '047',
    label: '047 - Banese',
  },
  {
    value: '062',
    label: '062 - Hipercard',
  },
  {
    value: '063',
    label: '063 - Ibibank',
  },
  {
    value: '065',
    label: '065 - Lemon Bank',
  },
  {
    value: '066',
    label: '066 - Banco Morgan Stanley Dean Witter',
  },
  {
    value: '069',
    label: '069 - BPN Brasil',
  },
  {
    value: '070',
    label: '070 - Banco de Brasília – BRB',
  },
  {
    value: '072',
    label: '072 - Banco Rural',
  },
  {
    value: '073',
    label: '073 - Banco Popular',
  },
  {
    value: '074',
    label: '074 - Banco J. Safra',
  },
  {
    value: '075',
    label: '075 - Banco CR2',
  },
  {
    value: '076',
    label: '076 - Banco KDB',
  },
  {
    value: '077',
    label: '077 - Banco Inter',
  },
  {
    value: '096',
    label: '096 - Banco BMF',
  },
  {
    value: '104',
    label: '104 - Caixa Econômica Federal',
  },
  {
    value: '107',
    label: '107 - Banco BBM',
  },
  {
    value: '116',
    label: '116 - Banco Único',
  },
  {
    value: '151',
    label: '151 - Nossa Caixa',
  },
  {
    value: '175',
    label: '175 - Banco Finasa',
  },
  {
    value: '184',
    label: '184 - Banco Itaú BBA',
  },
  {
    value: '204',
    label: '204 - American Express Bank',
  },
  {
    value: '208',
    label: '208 - Banco Pactual',
  },
  {
    value: '212',
    label: '212 - Banco Matone',
  },
  {
    value: '213',
    label: '213 - Banco Arbi',
  },
  {
    value: '214',
    label: '214 - Banco Dibens',
  },
  {
    value: '217',
    label: '217 - Banco Joh Deere',
  },
  {
    value: '218',
    label: '218 - Banco Bonsucesso',
  },
  {
    value: '222',
    label: '222 - Banco Calyon Brasil',
  },
  {
    value: '224',
    label: '224 - Banco Fibra',
  },
  {
    value: '225',
    label: '225 - Banco Brascan',
  },
  {
    value: '229',
    label: '229 - Banco Cruzeiro',
  },
  {
    value: '230',
    label: '230 - Unicard',
  },
  {
    value: '233',
    label: '233 - Banco GE Capital',
  },
  {
    value: '237',
    label: '237 - Bradesco',
  },
  {
    value: '237',
    label: '237 - Next',
  },
  {
    value: '241',
    label: '241 - Banco Clássico',
  },
  {
    value: '243',
    label: '243 - Banco Stock Máxima',
  },
  {
    value: '246',
    label: '246 - Banco ABC Brasil',
  },
  {
    value: '248',
    label: '248 - Banco Boavista Interatlântico',
  },
  {
    value: '249',
    label: '249 - Investcred Unibanco',
  },
  {
    value: '250',
    label: '250 - Banco Schahin',
  },
  {
    value: '252',
    label: '252 - Fininvest',
  },
  {
    value: '254',
    label: '254 - Paraná Banco',
  },
  {
    value: '263',
    label: '263 - Banco Cacique',
  },
  {
    value: '260',
    label: '260 - Nubank',
  },
  {
    value: '265',
    label: '265 - Banco Fator',
  },
  {
    value: '266',
    label: '266 - Banco Cédula',
  },
  {
    value: '300',
    label: '300 - Banco de la Nación Argentina',
  },
  {
    value: '318',
    label: '318 - Banco BMG',
  },
  {
    value: '320',
    label: '320 - Banco Industrial e Comercial',
  },
  {
    value: '356',
    label: '356 - ABN Amro Real',
  },
  {
    value: '341',
    label: '341 - Itaú',
  },
  {
    value: '347',
    label: '347 - Sudameris',
  },
  {
    value: '351',
    label: '351 - Banco Santander',
  },
  {
    value: '353',
    label: '353 - Banco Santander Brasil',
  },
  {
    value: '366',
    label: '366 - Banco Societe Generale Brasil',
  },
  {
    value: '370',
    label: '370 - Banco WestLB',
  },
  {
    value: '376',
    label: '376 - JP Morgan',
  },
  {
    value: '389',
    label: '389 - Banco Mercantil do Brasil',
  },
  {
    value: '394',
    label: '394 - Banco Mercantil de Crédito',
  },
  {
    value: '399',
    label: '399 - HSBC',
  },
  {
    value: '409',
    label: '409 - Unibanco',
  },
  {
    value: '412',
    label: '412 - Banco Capital',
  },
  {
    value: '422',
    label: '422 - Banco Safra',
  },
  {
    value: '453',
    label: '453 - Banco Rural',
  },
  {
    value: '456',
    label: '456 - Banco Tokyo Mitsubishi UFJ',
  },
  {
    value: '464',
    label: '464 - Banco Sumitomo Mitsui Brasileiro',
  },
  {
    value: '477',
    label: '477 - Citibank',
  },
  {
    value: '479',
    label: '479 - Itaubank (antigo Bank Boston)',
  },
  {
    value: '487',
    label: '487 - Deutsche Bank',
  },
  {
    value: '488',
    label: '488 - Banco Morgan Guaranty',
  },
  {
    value: '492',
    label: '492 - Banco NMB Postbank',
  },
  {
    value: '494',
    label: '494 - Banco la República Oriental del Uruguay',
  },
  {
    value: '495',
    label: '495 - Banco La Provincia de Buenos Aires',
  },
  {
    value: '505',
    label: '505 - Banco Credit Suisse',
  },
  {
    value: '600',
    label: '505 - Banco Luso Brasileiro',
  },
  {
    value: '604',
    label: '604 - Banco Industrial',
  },
  {
    value: '610',
    label: '610 - Banco VR',
  },
  {
    value: '611',
    label: '611 - Banco Paulista',
  },
  {
    value: '612',
    label: '612 - Banco Guanabara',
  },
  {
    value: '613',
    label: '613 - Banco Pecunia',
  },
  {
    value: '623',
    label: '623 - Banco Panamericano',
  },
  {
    value: '626',
    label: '626 - Banco Ficsa',
  },
  {
    value: '630',
    label: '630 - Banco Intercap',
  },
  {
    value: '633',
    label: '633 - Banco Rendimento',
  },
  {
    value: '634',
    label: '634 - Banco Triângulo',
  },
  {
    value: '637',
    label: '637 - Banco Sofisa',
  },
  {
    value: '638',
    label: '638 - Banco Prosper',
  },
  {
    value: '643',
    label: '643 - Banco Pine',
  },
  {
    value: '652',
    label: '652 - Itaú Holding Financeira',
  },
  {
    value: '653',
    label: '653 - Banco Indusval',
  },
  {
    value: '654',
    label: '654 - Banco A.J. Renner',
  },
  {
    value: '655',
    label: '655 - Banco Votorantim',
  },
  {
    value: '707',
    label: '707 - Banco Daycoval',
  },
  {
    value: '719',
    label: '719 - Banif',
  },
  {
    value: '721',
    label: '721 - Banco Credibel',
  },
  {
    value: '734',
    label: '734 - Banco Gerdau',
  },
  {
    value: '735',
    label: '735 - Banco Neon',
  },
  {
    value: '738',
    label: '738 - Banco Morada',
  },
  {
    value: '739',
    label: '739 - Banco Galvão de Negócios',
  },
  {
    value: '740',
    label: '740 - Banco Barclays',
  },
  {
    value: '741',
    label: '741 - BRP',
  },
  {
    value: '743',
    label: '743 - Banco Semear',
  },
  {
    value: '745',
    label: '745 - Banco Citibank',
  },
  {
    value: '746',
    label: '746 - Banco Modal',
  },
  {
    value: '747',
    label: '747 - Banco Rabobank International',
  },
  {
    value: '748',
    label: '748 - Banco Cooperativo Sicredi',
  },
  {
    value: '749',
    label: '749 - Banco Simples',
  },
  {
    value: '751',
    label: '751 - Dresdner Bank',
  },
  {
    value: '752',
    label: '752 - BNP Paribas',
  },
  {
    value: '753',
    label: '753 - Banco Comercial Uruguai',
  },
  {
    value: '755',
    label: '755 - Banco Merrill Lynch',
  },
  {
    value: '756',
    label: '756 - Banco Cooperativo do Brasil',
  },
  {
    value: '757',
    label: '757 - KEB',
  },
];
