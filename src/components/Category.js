import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import {
  getTransactionMonth,
  getFirstMonth,
  sanitizeName
} from "../budgetUtils";
import pages, { makeLink } from "../pages";
import MonthByMonthSection from "./MonthByMonthSection";
import GenericEntitiesSection from "./GenericEntitiesSection";
import TransactionsByMonthSection from "./TransactionsByMonthSection";

class Category extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          payee_id: PropTypes.string.isRequired
        })
      ).isRequired,
      payeesById: PropTypes.object.isRequired
    }).isRequired,
    category: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired,
    transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSelectMonth: PropTypes.func.isRequired,
    onSelectPayee: PropTypes.func.isRequired,
    selectedMonth: PropTypes.string,
    selectedPayeeId: PropTypes.string
  };

  render() {
    const {
      category,
      budget,
      selectedMonth,
      selectedPayeeId,
      transactions,
      onSelectMonth,
      onSelectPayee
    } = this.props;
    const { categoriesById, payeesById, id: budgetId } = budget;

    const selectedPayee = selectedPayeeId && payeesById[selectedPayeeId];
    const firstMonth = getFirstMonth(budget);
    const transactionsForCategory = transactions.filter(
      transaction => transaction.category_id === category.id
    );
    const transactionsForMonth =
      selectedMonth &&
      transactionsForCategory.filter(
        transaction => getTransactionMonth(transaction) === selectedMonth
      );

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={firstMonth}
          transactions={transactionsForCategory}
          selectedMonth={selectedMonth}
          onSelectMonth={onSelectMonth}
          highlightFunction={
            selectedPayeeId &&
            (transaction => transaction.payee_id === selectedPayeeId)
          }
          title={
            selectedPayee
              ? `Month by Month: ${sanitizeName(selectedPayee.name)}`
              : "Month by Month"
          }
        />
        <GenericEntitiesSection
          key={`payees-${selectedMonth || "all"}`}
          entitiesById={payeesById}
          entityKey="payee_id"
          linkFunction={payeeId =>
            makeLink(pages.categoryPayee.path, {
              budgetId,
              categoryGroupId: category.category_group_id,
              categoryId: category.id,
              payeeId
            })
          }
          title={
            selectedMonth
              ? `Payees: ${moment(selectedMonth).format("MMMM")}`
              : "Payees"
          }
          transactions={transactionsForMonth || transactionsForCategory}
          selectedEntityId={selectedPayeeId}
          onClickEntity={onSelectPayee}
          limitShowing
        />
        {selectedMonth &&
          transactionsForMonth.length > 0 && (
            <TransactionsByMonthSection
              key={`transactions-${selectedMonth || "all"}-${selectedPayeeId ||
                "all"}`}
              categoriesById={categoriesById}
              payeesById={payeesById}
              transactions={transactionsForMonth}
              selectedMonth={selectedMonth}
              selectedPayeeId={selectedPayeeId}
            />
          )}
      </Fragment>
    );
  }
}

export default Category;
