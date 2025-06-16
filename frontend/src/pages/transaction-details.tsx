import { transactions } from "@/data/dummy-data";
import TabsLayout from "@/layouts/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Tag,
  Wallet,
  User,
  FileText,
  Paperclip,
} from "lucide-react";
import { IconRenderer } from "@/components/icon-renderer";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { transactionTypes } from "@/data/transaction-types";
import { cn } from "@/lib/utils";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import HeaderDropdownMenu from "@/components/transaction-details/header-dropdown-menu";

const TransactionDetails = () => {
  const { id } = useParams();

  const transaction = transactions.find((transaction) => transaction.id === id);

  const getTransactionType = (type: string) => {
    const transactionType = transactionTypes.find(
      (transactionType) => transactionType.id === type
    );
    return transactionType;
  };

  const getAmountColor = (type: string) => {
    if (type === "income") return transactionTypes[0].color;
    if (type === "expense") return transactionTypes[1].color;
    return transactionTypes[2].color;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <TabsLayout
      header={{
        title: "Transaction Details",
        description: "Manage your transaction details",
        linkBackward: "/transactions",
        rightActions: <HeaderDropdownMenu />,
      }}
    >
      {transaction && (
        <div className="flex flex-col gap-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center relative"
                style={{
                  backgroundColor: transaction.category.bgColor,
                  color: transaction.category.color,
                }}
              >
                <IconRenderer
                  iconName={transaction.category.icon}
                  className="w-6 h-6 text-white"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center ${
                    getTransactionType(transaction.type)?.color
                  }`}
                >
                  <IconRenderer
                    iconName={getTransactionType(transaction.type)?.icon}
                    className="w-6 h-6"
                  />
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {transaction.title}
            </h1>
            <p
              className={`text-3xl font-bold ${getAmountColor(
                transaction.type
              )}`}
            >
              {Math.abs(transaction.amount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700 p-0">
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Transaction Details
                </h3>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs text-white",
                    getTransactionType(transaction.type)?.bgColor
                  )}
                >
                  {getTransactionType(transaction.type)?.name}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>Date</span>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {formatDate(transaction.date)}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>Time</span>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {formatTime(transaction.date)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <Tag className="w-4 h-4" />
                    <span>Category</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: transaction.category.bgColor,
                      }}
                    >
                      <IconRenderer
                        iconName={transaction.category.icon}
                        className="w-3 h-3 text-white"
                      />
                    </div>
                    <span className="font-medium text-sm text-slate-900 dark:text-white">
                      {transaction.category.name}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <Wallet className="w-4 h-4" />
                    <span>Account</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: transaction.account.bgColor,
                      }}
                    >
                      <IconRenderer
                        iconName={transaction.account.icon}
                        className="w-3 h-3 text-white"
                      />
                    </div>
                    <span className="font-medium text-sm text-slate-900 dark:text-white">
                      {transaction.account.name}
                    </span>
                  </div>
                </div>
              </div>

              {transaction.person?.name && (
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <User className="w-4 h-4" />
                    <span>Person</span>
                  </div>
                  <div className="flex gap-3 items-center justify-start">
                    <Avatar className="w-8 h-8 h-full">
                      <AvatarImage
                        src={transaction.person?.avatar}
                        alt={transaction.person?.name}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold tracking-tight">
                        {transaction.person?.name}
                      </span>
                      <span className="leading-none text-sm text-muted-foreground">
                        {transaction.person?.email}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <Tag className="w-4 h-4" />
                  <span>Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {transaction.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="rounded-full px-2 py-0.5 text-[10px]"
                      style={{
                        backgroundColor: tag.bgColor,
                        color: tag.color,
                      }}
                    >
                      <DynamicIcon
                        name={tag.icon as IconName}
                        className="w-3 h-3"
                      />
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description & Notes */}
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700 p-0">
            <CardContent className="flex flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Additional Information
                </h3>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <FileText className="w-4 h-4" />
                  <span>Note</span>
                </div>
                <p className="text-slate-900 dark:text-white text-sm bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  {transaction.note}
                </p>
              </div>

              {/* Attachments */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <Paperclip className="w-4 h-4" />
                    <span>Attachments</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {transaction.attachments?.map((attachment, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      {attachment.type === "image" ? (
                        <div className="flex flex-col items-center justify-center h-full gap-2">
                          <img
                            src={attachment.url || "/placeholder.svg"}
                            alt={attachment.name}
                            className="w-full h-20 object-cover rounded"
                          />
                          <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                            {attachment.name}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-2">
                          <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded flex items-center justify-center">
                            <FileText className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                            {attachment.name}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!transaction && (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-500 dark:text-slate-400">
            Transaction not found
          </p>
        </div>
      )}
    </TabsLayout>
  );
};

export default TransactionDetails;
