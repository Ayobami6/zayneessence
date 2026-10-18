import { DeliveryMethodId } from '@/types/domain';

export interface NigerianStateEntry {
  name: string;
  code: string;
  zone: DeliveryMethodId;
  citiesOrLgas: string[];
}

export const NIGERIA_STATES_AND_FCT: NigerianStateEntry[] = [
  {
    name: 'Lagos',
    code: 'LA',
    zone: 'lagos_abuja',
    citiesOrLgas: ['Ikoyi', 'Victoria Island', 'Lekki Phase 1', 'Ikeja', 'Yaba', 'Surulere', 'Ajah', 'Maryland', 'Magodo', 'Apapa'],
  },
  {
    name: 'Federal Capital Territory (Abuja)',
    code: 'FC',
    zone: 'lagos_abuja',
    citiesOrLgas: ['Maitama', 'Asokoro', 'Wuse II', 'Garki', 'Jabi', 'Utako', 'Gwarinpa', 'Katampe', 'Guzape', 'Lugbe'],
  },
  {
    name: 'Abia',
    code: 'AB',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Umuahia', 'Aba North', 'Aba South', 'Ohafia', 'Bende'],
  },
  {
    name: 'Adamawa',
    code: 'AD',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Yola North', 'Yola South', 'Mubi', 'Numan', 'Ganye'],
  },
  {
    name: 'Akwa Ibom',
    code: 'AK',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Uyo', 'Eket', 'Ikot Ekpene', 'Oron', 'Abak'],
  },
  {
    name: 'Anambra',
    code: 'AN',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Awka', 'Onitsha', 'Nnewi', 'Ekwulobia', 'Obosi'],
  },
  {
    name: 'Bauchi',
    code: 'BA',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Bauchi', 'Azare', 'Misau', 'Jama’are', 'Dass'],
  },
  {
    name: 'Bayelsa',
    code: 'BY',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Yenagoa', 'Ogbia', 'Brass', 'Sagbama', 'Nembe'],
  },
  {
    name: 'Benue',
    code: 'BE',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Makurdi', 'Gboko', 'Otukpo', 'Katsina-Ala', 'Vandeikya'],
  },
  {
    name: 'Borno',
    code: 'BO',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Maiduguri', 'Jere', 'Biu', 'Bama', 'Monguno'],
  },
  {
    name: 'Cross River',
    code: 'CR',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Calabar Municipal', 'Calabar South', 'Ikom', 'Ogoja', 'Ugep'],
  },
  {
    name: 'Delta',
    code: 'DE',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Asaba', 'Warri', 'Ughelli', 'Sapele', 'Agbor'],
  },
  {
    name: 'Ebonyi',
    code: 'EB',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Abakaliki', 'Afikpo', 'Onueke', 'Ishielu', 'Ezza'],
  },
  {
    name: 'Edo',
    code: 'ED',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Benin City (Oredo)', 'Ekpoma', 'Auchi', 'Uromi', 'Igarra'],
  },
  {
    name: 'Ekiti',
    code: 'EK',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Ado-Ekiti', 'Ikere', 'Oye-Ekiti', 'Ijero', 'Ikole'],
  },
  {
    name: 'Enugu',
    code: 'EN',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Enugu North', 'Enugu South', 'Nsukka', 'Agbani', 'Oji River'],
  },
  {
    name: 'Gombe',
    code: 'GO',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Gombe', 'Kaltungo', 'Billiri', 'Bajoga', 'Dukku'],
  },
  {
    name: 'Imo',
    code: 'IM',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Owerri Municipal', 'Owerri North', 'Orlu', 'Okigwe', 'Oguta'],
  },
  {
    name: 'Jigawa',
    code: 'JI',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Dutse', 'Hadejia', 'Gumel', 'Kazaure', 'Ringim'],
  },
  {
    name: 'Kaduna',
    code: 'KD',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Kaduna North', 'Kaduna South', 'Zaria', 'Kafanchan', 'Sabon Gari'],
  },
  {
    name: 'Kano',
    code: 'KN',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Nassarawa (Kano)', 'Tarauni', 'Fagge', 'Gwale', 'Kano Municipal', 'Dala'],
  },
  {
    name: 'Katsina',
    code: 'KT',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Katsina', 'Daura', 'Funtua', 'Malumfashi', 'Dutsin-Ma'],
  },
  {
    name: 'Kebbi',
    code: 'KE',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Birnin Kebbi', 'Argungu', 'Yauri', 'Zuru', 'Jega'],
  },
  {
    name: 'Kogi',
    code: 'KO',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Lokoja', 'Okene', 'Anyigba', 'Idah', 'Kabba'],
  },
  {
    name: 'Kwara',
    code: 'KW',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Ilorin West', 'Ilorin South', 'Offa', 'Omu-Aran', 'Jebba'],
  },
  {
    name: 'Nasarawa',
    code: 'NA',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Lafia', 'Karu', 'Keffi', 'Akwanga', 'Nasarawa'],
  },
  {
    name: 'Niger',
    code: 'NI',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Minna', 'Bida', 'Suleja', 'Kontagora', 'Mokwa'],
  },
  {
    name: 'Ogun',
    code: 'OG',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Abeokuta South', 'Ijebu Ode', 'Sagamu', 'Ota', 'Ilaro'],
  },
  {
    name: 'Ondo',
    code: 'ON',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Akure South', 'Ondo West', 'Owo', 'Ikare', 'Okitipupa'],
  },
  {
    name: 'Osun',
    code: 'OS',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Osogbo', 'Ile-Ife', 'Ilesa', 'Ede', 'Iwo'],
  },
  {
    name: 'Oyo',
    code: 'OY',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Ibadan North', 'Ibadan South-West', 'Ogbomoso', 'Oyo East', 'Iseyin'],
  },
  {
    name: 'Plateau',
    code: 'PL',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Jos North', 'Jos South', 'Bukuru', 'Pankshin', 'Shendam'],
  },
  {
    name: 'Rivers',
    code: 'RI',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Port Harcourt', 'Obio-Akpor', 'Bonny', 'Eleme', 'Oyigbo'],
  },
  {
    name: 'Sokoto',
    code: 'SO',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Sokoto North', 'Sokoto South', 'Wamakko', 'Tambuwal', 'Illela'],
  },
  {
    name: 'Taraba',
    code: 'TA',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Jalingo', 'Wukari', 'Bali', 'Gembu', 'Takum'],
  },
  {
    name: 'Yobe',
    code: 'YO',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Damaturu', 'Potiskum', 'Gashua', 'Nguru', 'Geidam'],
  },
  {
    name: 'Zamfara',
    code: 'ZA',
    zone: 'rest_of_nigeria',
    citiesOrLgas: ['Gusau', 'Kaura Namoda', 'Talata Mafara', 'Anka', 'Bungudu'],
  },
];

export function isLagosOrAbuja(stateName: string): boolean {
  const entry = NIGERIA_STATES_AND_FCT.find(
    (s) => s.name.toLowerCase() === stateName.toLowerCase()
  );
  return entry?.zone === 'lagos_abuja';
}
