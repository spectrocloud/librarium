import { library } from '@fortawesome/fontawesome-svg-core'
import {fas} from "@fortawesome/free-solid-svg-icons";

export * from './theme';
export mdxComponents from './mdxComponents';
export ThemeProvider from './theme/Provider';
export Layout from './layout';
export Link from './link';

library.add(fas)
// TODO move this outside of this package
// find a good place for init
