module.exports = {
  "extends": [ "next", "prettier" ],
  "rules": {
    "indent" : [ "warn", 2, { "SwitchCase": 1 } ],
    "semi"   : [ "warn", "always" ],
    "quotes" : [ "warn", "single" ],
    "react/no-unescaped-entities" : "off",
    
    // TODO: TS compat?
    // "indent": "off",
    // "@typescript-eslint/indent": [ "warn", 2, { "SwitchCase": 1 } ],
  }
};
