export function createInstance(creator, concreteProperties) {
  return creator.create(concreteProperties);
}

export abstract class FactoryCreator {
  public abstract factoryMethod();
  public create(properties) {
    const instance = this.factoryMethod();
    return instance.prepare(properties);
  }
}

export interface IBasePrepare<ServerObject, DatabaseObject> {
  prepare(serverObject: ServerObject): DatabaseObject;
}
