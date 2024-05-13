// From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
const COUNTRIES = [
  { code: "AL", label: "Albania", phone: "355" },
];
const CITIES = {
  AL: [
    "Tirana",
    "Durres",
    "Vlore",
    "Himare",
    "Sarande",
    "Librazhd"
  ]
};

const ZONES = {
  "Durres": [
    "Durres Yacht Marina", "Gjiri i Lalzit", "Golem", "Hamallaj", "Kavalishenca",
    "Plepa", "Porto Romano", "Qender", "Shkembi i Kavajes"
  ],
  "Himare": [
    "Borsh", "Dhermi", "Jale", "Palase", "Potam", "Qeparo", "Vuno"
  ],
  "Tirana": [
    "21 Dhjetori", "5 Maji", "Aeroporti", "Ali Demi", "Allias", "Ambasada Amerikane", "Ambasada Gjermane",
    "Arbane", "Astir", "Autostrada Tirane - Durres", "Autostrada Tirane - Elbasan",
    "Babrru", "Baldushk", "Bathore", "Blloku", "Blloku i Ambasadave", "Brryli", "Bulevardi Bajram Curri",
    "Bulevardi Gjergj Fishta", "Bulevardi i Ri", "Bulevardi Zhan D'Ark", "Bulevardi Zogu I",
    "Casa Italia", "Concord Center", "Dajt", "Don Bosko", "Ekspozita", "Farke", "Rruga e Kosovarëve",
    "Sheshi Wilson", "Fresku", "Gjimnazi Partizani", "Ish Fusha e Aviacionit", "Inxhinjeria e Ndertimit",
    "Kamez", "Kashar", "Kodra e Diellit", "Kodra e Priftit", "Kompleksi Dinamo",
    "Komuna e Parisit", "Kombinat", "Kopshti Botanik", "Kopshti Zoologjik",
    "Lanabregas", "Laprake", "Liqeni Artificial", "Liqeni i Farkes", "Garda", "Rruga Sami Frashëri",
    "Liqeni i Thate", "Lumi Lana", "Medreseja", "Mezez", "Mullet", "Myslym Shyri",
    "Ndroq", "Pallati me Shigjeta", "Pazari i Ri", "Peze", "Piramida", "Porcelan",
    "Priske", "Prokuroria", "QTU", "Qender", "Qytet Studenti", "Rinas", "Rruga Bardhyl",
    "Rruga Dritan Hoxha", "Rruga e Dibres", "Rruga e Durresit", "Rruga e Elbasanit", "Rruga e Kavajes",
    "Rruga Fortuzi", "Rruga Hoxha Tahsim", "Rruga Jordan Misja", "Rruga Kongresi i Manastirit",
    "Rruga Margarita Tutulani", "Rruga Mine Peza", "Rruga Peti", "Rruga Riza Cerova",
    "Rruga Shefqet Ndroqi", "Rruga Siri Kodra", "Rruga Sulejman Delvina",
    "Rruga Ura", "Selite", "Selvia", "Sauk", "Sheshi Nene Tereza", "Sheshi Skenderbej",
    "Shkolla e Kuqe", "Shkoze", "Shengjergj", "Spitali QSUT", "Stacioni i Trenit", "Garda",
    "Linze", "Paskuqan", "Kinostudio", "RTSH", "Prush", "Rruga Xhanfize Keko", "Oxhaku", "Berzhite", "Krrabe",
    "Stadiumi Dinamo", "Stadiumi Selman Stermasi", "Surrel", "Taiwan Park", "TEG", "Tregu Elektrik",
    "Tufine", "Uzina Dinamo", "Vasil Shanto", "Vaqarr", "Vilat Gjermane", "Vore",
    "Xhamllik", "Yzberisht", "Zogu i Zi", "Lundër"
  ],
  "Vlore": [
    "Lungomare", "Narte", "Orikum", "Plazhi i Vjeter", "Qender", "Radhime", "Uji i Ftohte", "Zvernec"
  ],
  "Sarande": [
    "Sarande"
  ],
  "Librazhd": [
    "Stacioni i trenit", "Rruga Çermenika", "Rruga Hekurudha", "Rruga Jakup Bicaku", "Rruga 10 Nentori", "Rruga Beg Balla", "Rruga Hajdar Bllashmi", "Rruga Arberia", "Rruga Gjorg Golemi"
  ]
};
export {COUNTRIES, CITIES, ZONES};