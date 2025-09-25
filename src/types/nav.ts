// types/nav.ts
export interface NavChild {
    key: string;
    path: string;
    label: string;
    children?: NavChild[];
  }
  
  export interface NavItem extends Omit<NavChild, 'children'> {
    roles: string[];
    children?: NavChild[];
  }

// export interface NavItem {
//     key: string;
//     label: string;
//     roles: string[];
//     path: string;
//     children?: NavChild[];  // Một số NavItem có thể có children
//   }