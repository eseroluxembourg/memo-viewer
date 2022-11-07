import * as layouts from '@/data/layouts';

export default {
  validLayouts() {
    return layouts.validLayouts;
  },
  isValidLayout(layoutName) {
    return layoutName === '' || this.validLayouts().includes(layoutName);
  },
  defaultLayout() {
    return layouts.defaultLayout;
  },
  getLayoutByName(layoutName) {
    return layouts.getLayoutByName(layoutName);
  },
};
