export enum RootRoutes {
  Splash = 'Splash',
  AuthStack = 'AuthStack',
  MainTabs = 'MainTabs', 
}

export enum AuthRoutes {
  Login = 'Login',
  SignUp = 'SignUp',
}

export enum MainRoute {
  Home = 'Home',
  ScanProduct = 'Scan',
  History = 'History',
  Account = 'Account',
  Bot = 'Bot',
  Search = 'Search',
  Product = 'Product',
  ProfileEdit = 'ProfileEdit',
  ScanReport = 'ScanReport',
}

/* ---------------- ROOT STACK ---------------- */

export type RootStackParamList = {
  [RootRoutes.AuthStack]: undefined;
  [RootRoutes.MainTabs]: undefined;
};

/* ---------------- AUTH STACK ---------------- */

export type AuthStackParamList = {
  [AuthRoutes.Login]: undefined;
  [AuthRoutes.SignUp]: undefined;
};

/* ---------------- TAB NAVIGATOR ---------------- */
/* ONLY TAB SCREENS GO HERE */

export type MainTabParamList = {
  [MainRoute.Home]: undefined;
  [MainRoute.History]: undefined;
  [MainRoute.ScanProduct]: undefined;
  [MainRoute.Account]: undefined;
  [MainRoute.Bot]: undefined;
};

/* ---------------- MAIN STACK ---------------- */
/* SCREENS ABOVE TABS */

export type MainStackParamList = {
  [MainRoute.ScanReport]: { barcode: string }; // ✅ REQUIRED
  [MainRoute.Product]: { barcode: string } | undefined;
  [MainRoute.ProfileEdit]: undefined;
};
