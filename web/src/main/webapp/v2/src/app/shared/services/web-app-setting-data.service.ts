import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'angular-2-local-storage';
import 'moment-timezone';
import * as moment from 'moment-timezone';

import { AppState, Actions } from 'app/shared/store';
import { ComponentDefaultSettingDataService } from 'app/shared/services/component-default-setting-data.service';
import { Application, Period } from 'app/core/models';
import { NewUrlStateNotificationService } from 'app/shared/services/new-url-state-notification.service';

interface IMinMax {
    min: number;
    max: number;
}

@Injectable()
export class WebAppSettingDataService {
    static KEYS = {
        FAVORLIITE_APPLICATION_LIST: 'favoriteApplicationList',
        TIMEZONE: 'timezone',
        DATE_FORMAT: 'dateFormat',
        LIST_HANDLE_POSITION: 'listHandlePosition',
        LAYER_HEIGHT: 'layerHeight',
        USER_DEFAULT_INBOUND: 'userDefaultInbound',
        USER_DEFAULT_OUTBOUND: 'userDefaultOutbound',
        USER_DEFAULT_PERIOD: 'userDefaultPeriod',
        TRANSACTION_LIST_GUTTER_POSITION: 'transactionListGutterPosition',
        CHART_NUM_PER_ROW: 'chartNumPerRow'
    };
    private IMAGE_PATH = './assets/img/';
    private IMAGE_EXT = '.png';
    private SERVER_MAP_PATH = 'servermap/';
    private ICON_PATH = 'icons/';
    private LOGO_IMG_NAME = 'logo.png';
    constructor(
        private store: Store<AppState>,
        private localStorageService: LocalStorageService,
        private componentDefaultSettingDataService: ComponentDefaultSettingDataService,
        private newUrlStateNotificationService: NewUrlStateNotificationService
    ) {
        this.store.dispatch(new Actions.AddFavoriteApplication(this.getFavoriteApplicationList()));
        this.store.dispatch(new Actions.ChangeTimezone(this.getTimezone()));
        this.store.dispatch(new Actions.ChangeDateFormat(this.getDateFormat()));
    }
    useActiveThreadChart(): Observable<boolean> {
        return this.newUrlStateNotificationService.getConfiguration('showActiveThread');
    }
    getUserId(): Observable<string | undefined> {
        return this.newUrlStateNotificationService.getConfiguration('userId');
    }
    getUserDepartment(): Observable<string | undefined> {
        return this.newUrlStateNotificationService.getConfiguration('userDepartment');
    }
    useUserEdit(): Observable<boolean> {
        return this.newUrlStateNotificationService.getConfiguration('editUserInfo');
    }
    isDataUsageAllowed(): Observable<boolean> {
        return this.newUrlStateNotificationService.getConfiguration('sendUsage');
    }
    getVersion(): Observable<string> {
        return this.newUrlStateNotificationService.getConfiguration('version');
    }
    isApplicationInspectorActivated(): Observable<boolean> {
        return this.newUrlStateNotificationService.getConfiguration('showApplicationStat');
    }
    getImagePath(): string {
        return this.IMAGE_PATH;
    }
    getServerMapImagePath(): string {
        return this.getImagePath() + this.SERVER_MAP_PATH;
    }
    getIconImagePath(): string {
        return this.getImagePath() + this.ICON_PATH;
    }
    getImageExt(): string {
        return this.IMAGE_EXT;
    }
    getLogoPath(): string {
        return this.getImagePath() + this.LOGO_IMG_NAME;
    }
    getSystemDefaultInbound(): number {
        return this.componentDefaultSettingDataService.getSystemDefaultInbound();
    }
    getSystemDefaultOutbound(): number {
        return this.componentDefaultSettingDataService.getSystemDefaultOutbound();
    }
    getSystemDefaultPeriod(): Period {
        return this.componentDefaultSettingDataService.getSystemDefaultPeriod();
    }
    getSystemDefaultTransactionViewPeriod(): Period {
        return this.componentDefaultSettingDataService.getSystemDefaultTransactionViewPeriod();
    }
    getSystemDefaultChartLayoutOption(): number {
        return this.componentDefaultSettingDataService.getSystemDefaultChartLayoutOption();
    }
    getInboundList(): number[] {
        return this.componentDefaultSettingDataService.getInboundList();
    }
    getOutboundList(): number[] {
        return this.componentDefaultSettingDataService.getOutboundList();
    }
    getPeriodList(path: string): Period[] {
        return this.componentDefaultSettingDataService.getPeriodList(path);
    }
    getMaxPeriodTime(): number {
        return this.componentDefaultSettingDataService.getMaxPeriodTime();
    }
    getColorByRequest(): string[] {
        return this.componentDefaultSettingDataService.getColorByRequest();
    }
    private loadFavoriteList(): any[] {
        return JSON.parse(this.localStorageService.get(WebAppSettingDataService.KEYS.FAVORLIITE_APPLICATION_LIST)) || [];
    }
    private saveFavoriteList(data: any[]): void {
        this.localStorageService.set(WebAppSettingDataService.KEYS.FAVORLIITE_APPLICATION_LIST, JSON.stringify(data));
    }
    addFavoriteApplication(application: IApplication): void {
        this.saveFavoriteList([...this.loadFavoriteList(), {
            applicationName: application.getApplicationName(),
            serviceType: application.getServiceType(),
            code: application.getCode()
        }]);
        this.store.dispatch(new Actions.AddFavoriteApplication([application]));
    }
    removeFavoriteApplication(application: IApplication): void {
        const removedList = this.getFavoriteApplicationList().filter((app: IApplication) => {
            return !app.equals(application);
        });
        this.saveFavoriteList(removedList);
        this.store.dispatch(new Actions.RemoveFavoriteApplication([application]));
    }
    private getFavoriteApplicationList(): IApplication[] {
        return this.loadFavoriteList().map(({applicationName, serviceType, code}) => {
            return new Application(applicationName, serviceType, code);
        });
    }
    getScatterY(key: string): IMinMax {
        return this.localStorageService.get<IMinMax>(key) || { min: 0, max: 10000 };
    }
    setScatterY(key: string, value: IMinMax): void {
        this.localStorageService.set(key, value);
    }
    setTimezone(value: string): void {
        this.localStorageService.set(WebAppSettingDataService.KEYS.TIMEZONE, value);
    }
    private getTimezone(): string {
        return this.localStorageService.get(WebAppSettingDataService.KEYS.TIMEZONE) || this.getDefaultTimezone();
    }
    getDefaultTimezone(): string {
        return moment.tz.guess();
    }
    setDateFormat(value: number): void {
        this.localStorageService.set(WebAppSettingDataService.KEYS.DATE_FORMAT, value);
    }
    private getDateFormat(): number {
        return this.localStorageService.get(WebAppSettingDataService.KEYS.DATE_FORMAT) || 0;
    }
    getDefaultDateFormat(): string[] {
        return this.componentDefaultSettingDataService.getDefaultDateFormat();
    }
    getDateFormatList(): string[][] {
        return this.componentDefaultSettingDataService.getDateFormatList();
    }
    setListHandlePosition(value: number[]): void {
        this.localStorageService.set(WebAppSettingDataService.KEYS.LIST_HANDLE_POSITION, value);
    }
    getListHandlePosition(): number[] {
        return this.localStorageService.get(WebAppSettingDataService.KEYS.LIST_HANDLE_POSITION) || [30, 70];
    }
    setLayerHeight(value: number): void {
        this.localStorageService.set(WebAppSettingDataService.KEYS.LAYER_HEIGHT, value);
    }
    getLayerHeight(): number {
        return Number.parseInt(this.localStorageService.get(WebAppSettingDataService.KEYS.LAYER_HEIGHT), 10);
    }
    setUserDefaultInbound(value: number): void {
        this.localStorageService.set(WebAppSettingDataService.KEYS.USER_DEFAULT_INBOUND, value);
    }
    getUserDefaultInbound(): number {
        return this.localStorageService.get<number>(WebAppSettingDataService.KEYS.USER_DEFAULT_INBOUND) || this.getSystemDefaultInbound();
    }
    setUserDefaultOutbound(value: number): void {
        this.localStorageService.set(WebAppSettingDataService.KEYS.USER_DEFAULT_OUTBOUND, value);
    }
    getUserDefaultOutbound(): number {
        return this.localStorageService.get<number>(WebAppSettingDataService.KEYS.USER_DEFAULT_OUTBOUND) || this.getSystemDefaultOutbound();
    }
    setUserDefaultPeriod(value: Period): void {
        this.localStorageService.set(WebAppSettingDataService.KEYS.USER_DEFAULT_PERIOD, value.getValue());
    }
    getUserDefaultPeriod(): Period {
        const userDefaultPeriodInMinute = this.localStorageService.get<number>(WebAppSettingDataService.KEYS.USER_DEFAULT_PERIOD);

        return userDefaultPeriodInMinute ? new Period(userDefaultPeriodInMinute) : this.getSystemDefaultPeriod();
    }
    getServerMapIconPathMakeFunc(): Function {
        return (name: string) => {
            return this.IMAGE_PATH + this.SERVER_MAP_PATH + name + this.IMAGE_EXT;
        };
    }
    getIconPathMakeFunc(): Function {
        return (name: string) => {
            return this.IMAGE_PATH + this.ICON_PATH + name + this.IMAGE_EXT;
        };
    }
    getImagePathMakeFunc(): Function {
        return (name: string) => {
            return this.IMAGE_PATH + name + this.IMAGE_EXT;
        };
    }
    setChartLayoutOption(chartNumPerRow: number): void {
        this.localStorageService.set(WebAppSettingDataService.KEYS.CHART_NUM_PER_ROW, chartNumPerRow);
    }
    getChartLayoutOption(): number {
        return this.localStorageService.get<number>(WebAppSettingDataService.KEYS.CHART_NUM_PER_ROW) || this.getSystemDefaultChartLayoutOption();
    }
    getChartRefreshInterval(key: string): number {
        return this.getSystemDefaultChartRefreshInterval(key);
    }
    getSystemDefaultChartRefreshInterval(key: string): number {
        return this.componentDefaultSettingDataService.getSystemDefaultChartRefreshInterval(key);
    }
}
