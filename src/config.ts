import fastjsAjax from "../modules/ajax/main"

interface config {
    dom: {
        defaultTag: string,
        specialDom: Array<string>
    },
    modules: {
        ajax: {
            successCode: Array<number>,
            timeout: number,
            hooks: {
                before: Function,
                success: Function,
                failed: Function,
                callback: Function
            }
        }
    }
}

const _config: config = {
    dom: {
        defaultTag: "div",
        specialDom: ["body", "head", "html"]
    },
    modules: {
        ajax: {
            successCode: [200],
            // default timeout
            timeout: 5000,
            // return false to stop the request
            hooks: {
                // => ajax::Ajax
                before: (ajax: fastjsAjax) => ajax || true,
                // => ajax::Ajax
                success: (ajax: fastjsAjax) => ajax || true,
                // => ajax::Ajax
                failed: (ajax: fastjsAjax) => ajax || true,
                // => ajax::Ajax, data::Object
                callback: (ajax: fastjsAjax, data: {
                    [key: string]: any
                }) => ajax || data || true,
            }
        }
    }
}

export default _config