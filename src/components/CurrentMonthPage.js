import React, { Fragment } from "react";
import PropTypes from "prop-types";
import takeWhile from "lodash/fp/takeWhile";
import {
  getTransactionMonth,
  isTransfer,
  isStartingBalanceOrReconciliation,
  isIncome,
  sanitizeName
} from "../budgetUtils";
import { notAny } from "../dataUtils";
import pages, { makeLink } from "../pages";
import { useSelectedEntityId } from "../commonHooks";
import PageLayout from "./PageLayout";
import DayByDaySection from "./DayByDaySection";
import GenericEntitiesSection from "./GenericEntitiesSection";
import RecentSpending from "./RecentSpending";

const CurrentMonthPage = ({
  wrapperProps,
  title,
  budget,
  currentMonth,
  investmentAccounts
}) => {
  const [selectedGroupId, onSelectGroupId] = useSelectedEntityId();

  const {
    categoryGroupsById,
    categoriesById,
    payeesById,
    id: budgetId
  } = budget;
  const selectedGroup = selectedGroupId && categoryGroupsById[selectedGroupId];
  const transactions = budget.transactions.filter(
    notAny([
      isIncome(budget),
      isTransfer(investmentAccounts),
      isStartingBalanceOrReconciliation(budget)
    ])
  );
  const transactionsThisMonth = takeWhile(
    transaction => getTransactionMonth(transaction) === currentMonth
  )(transactions);

  return (
    <PageLayout
      {...wrapperProps}
      title={title}
      fixedContent={
        <DayByDaySection
          budgetId={budget.id}
          currentMonth={currentMonth}
          transactions={transactions}
          highlightFunction={
            selectedGroupId &&
            (transaction =>
              categoriesById[transaction.category_id].category_group_id ===
              selectedGroupId)
          }
          title={
            selectedGroup
              ? `Day by Day: ${sanitizeName(selectedGroup.name)}`
              : "Day by Day"
          }
        />
      }
      content={
        <Fragment>
          <RecentSpending
            categoriesById={categoriesById}
            currentMonth={currentMonth}
            payeesById={payeesById}
            transactions={transactionsThisMonth}
          />
          <GenericEntitiesSection
            entitiesById={categoryGroupsById}
            entityFunction={transaction =>
              categoriesById[transaction.category_id].category_group_id
            }
            entityKey="category_group_id"
            limitShowing
            linkFunction={groupId =>
              makeLink(pages.currentMonthGroup.path, {
                budgetId,
                categoryGroupId: groupId
              })
            }
            selectedEntityId={selectedGroupId}
            title="Category Groups"
            transactions={transactionsThisMonth}
            showTransactionCount
            onClickEntity={onSelectGroupId}
          />
        </Fragment>
      }
    />
  );
};

CurrentMonthPage.propTypes = {
  budget: PropTypes.object.isRequired,
  currentMonth: PropTypes.string.isRequired,
  investmentAccounts: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  wrapperProps: PropTypes.object.isRequired
};

export default CurrentMonthPage;