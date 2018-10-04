import {NavigationActions, StackActions} from "react-navigation";

export function resetAndNavigateTo(props, routeName) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: routeName })],
  });
  props.navigation.dispatch(resetAction);
}
