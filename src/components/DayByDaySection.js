import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { getSetting, setSetting } from "../uiRepo";
import CollapsibleSection from "./CollapsibleSection";
import SpendingChart from "./SpendingChart";
import ChartSettingsModal from "./ChartSettingsModal";

const MAX_MONTHS = 12;

class DayByDaySection extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    currentMonth: PropTypes.string.isRequired,
    transactions: PropTypes.array.isRequired,
    highlightFunction: PropTypes.func,
    title: PropTypes.string,
    total: PropTypes.number
  };

  static defaultProps = { title: "Day by Day" };

  constructor(props) {
    super();

    this.state = {
      modalOpen: false,
      monthsToCompare: getSetting("spendingMonthsToCompare", props.budgetId)
    };
  }

  handleClickSettings = () => {
    this.setState({ modalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  };

  handleDecrementMonths = () => {
    this.setState(
      state => ({
        ...state,
        monthsToCompare: Math.max(state.monthsToCompare - 1, 0)
      }),
      this.saveSetting
    );
  };

  handleIncrementMonths = () => {
    this.setState(
      state => ({
        ...state,
        monthsToCompare: Math.min(state.monthsToCompare + 1, MAX_MONTHS)
      }),
      this.saveSetting
    );
  };

  saveSetting = () => {
    setSetting(
      "spendingMonthsToCompare",
      this.props.budgetId,
      this.state.monthsToCompare
    );
  };

  render() {
    const {
      transactions,
      budgetId,
      currentMonth,
      highlightFunction,
      title,
      total
    } = this.props;
    const { modalOpen, monthsToCompare } = this.state;

    return (
      <Fragment>
        <CollapsibleSection
          title={title}
          hasSettings
          onClickSettings={this.handleClickSettings}
        >
          <SpendingChart
            budgetId={budgetId}
            currentMonth={currentMonth}
            highlightFunction={highlightFunction}
            monthsToCompare={monthsToCompare}
            total={total}
            transactions={transactions}
          />
        </CollapsibleSection>
        <ChartSettingsModal
          open={modalOpen}
          monthsToCompare={monthsToCompare}
          onClose={this.handleCloseModal}
          onDecrementMonths={this.handleDecrementMonths}
          onIncrementMonths={this.handleIncrementMonths}
        />
      </Fragment>
    );
  }
}

export default DayByDaySection;
