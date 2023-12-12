import _dev from "../dev";

enum FastjsExpression {
    Equal = 'equal',
    NotEqual = 'notEqual',
    TypeEqual = 'typeEqual',
    TypeNotEqual = 'typeNotEqual',
    ModuleEqual = 'moduleEqual',
    ModuleNotEqual = 'moduleNotEqual',
}

type FastjsExpressionResult = {
    [FastjsExpression.Equal]: boolean;
    [FastjsExpression.NotEqual]: boolean;
    [FastjsExpression.TypeEqual]: boolean;
    [FastjsExpression.TypeNotEqual]: boolean;
    [FastjsExpression.ModuleEqual]: number;
    [FastjsExpression.ModuleNotEqual]: boolean;
}

class FastjsBaseModule<T extends FastjsBaseModule<any>> {

    [key: string]: any;

    setCustomProp(name: string, value: any): T {
        this[name] = value;
        return this as unknown as T;
    }

    setCustomProps(props: {[key: string]: any}): T {
        for (const key in props) {
            this[key] = props[key];
        }
        return this as unknown as T;
    }

    getCustomProp(name: string): any {
        return this[name];
    }

    setCustomEvent(name: string, func: (module: T, ...args: any[]) => void, setup: boolean = false): T {
        this[name] = func;
        if (setup) func(this as unknown as T);
        return this as unknown as T;
    }

    callCustomEvent(name: string, ...args: any[]): T {
        this[name](this as unknown as T, ...args);
        return this as unknown as T;
    }

    then(func: (e: T) => void, time: number = 0): T {
        const callback = () => func(this as unknown as T);
        time === 0 ? callback() : setTimeout(callback, time);
        return this as unknown as T;
    }


    determine<T extends keyof FastjsExpressionResult>(value: any, expression: T): FastjsExpressionResult[T] {
        let result: any;
        switch (expression) {
            case FastjsExpression.Equal:
                result = value === this;
                break;
            case FastjsExpression.NotEqual:
                result = value !== this;
                break;
            case FastjsExpression.TypeEqual:
                result = typeof value === typeof this;
                break;
            case FastjsExpression.TypeNotEqual:
                result = typeof value !== typeof this;
                break;
            case FastjsExpression.ModuleEqual:
                result = value === this.constructor;
                break;
            case FastjsExpression.ModuleNotEqual:
                result = value !== this.constructor;
                break;
            default:
                if (__DEV__) {
                    _dev.warn("fastjs/base/FastjsBaseModule", "Invalid expression", [
                        "***expression: " + expression,
                        "value: " + value,
                        "determine<T extends keyof FastjsExpressionResult>(expression: T, value: FastjsExpressionResult[T]): FastjsExpressionResult[T]",
                        "FastjsBaseModule.determine",
                    ], ["fastjs.wrong"]);
                    throw _dev.error("fastjs/base/FastjsBaseModule", "Invalid expression", [
                        "determine<T extends keyof FastjsExpressionResult>(expression: T, value: FastjsExpressionResult[T]): FastjsExpressionResult[T]",
                        "FastjsBaseModule.determine",
                    ]);
                }
                throw ""
        }
        return result as FastjsExpressionResult[T];
    }
}

export {
    FastjsExpression
}

export default FastjsBaseModule;