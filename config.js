let config = {
  dom: {
    defaultTag: 'div',
    specialDom: ["#", "body", "head", "html"],
  },
  modules: {
    ajax: {
      successCode: [200],
      // default timeout
      timeout: 5000,
      // return false to stop the request
      hooks: {
        // => ajax::Ajax
        before: ajax => ajax || true,
        // => ajax::Ajax
        success: ajax => ajax || true,
        // => ajax::Ajax
        failed: ajax => ajax || true,
        // => ajax::Ajax, data::Object
        callback: (ajax, data) => ajax || data || true,
      }
    }
  }
}

export default config