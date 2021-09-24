import Authorized from './Authorized';
import check from './CheckPermissions.js';
import renderAuthorize from './renderAuthorize';

Authorized.check = check;
export default renderAuthorize(Authorized);
