import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PaginationItem } from '../models';
import { environment, environment as vars } from '../../../environments/environment';

const pageMatch = /page=\d+/g;
const offsetMatch = /offset=\d+/g;

interface PagedResponse<T> {
    pagination: PaginationItem[];
    count?: number;
    results: T[];
}

@Injectable({
    providedIn: 'root'
})
export class BaseAPIService {
    private acceptHeaders = new HttpHeaders({ Accept: 'application/json' });

    constructor(private http: HttpClient) { }

    public list<T>(host: string, url: string, queryParams: {} = {}): Observable<T> {
        /**
         * Get all objects of type T from a provided url endpoint.
         * @url: api endpoint.
         * @return: Observable for consumers to subscribe to.
         */
        return this.http.get<T>(
            `${host}${url}`, { headers: this.acceptHeaders, params: queryParams }
        ).pipe(catchError(err => throwError(err)));
    }

    public listResponse<T>(url: string, queryParams: {} = {}): Observable<{ body: T[], headers: HttpHeaders }> {
        return this.http.get<any>(
            `${environment.API_HOST}${url}`, { headers: this.acceptHeaders, params: queryParams, observe: 'response' }
        ).pipe(catchError(err => throwError(err)));
    }

    public listWithProgress<T>(url: string): Observable<HttpEvent<{}>> {
        const request = new HttpRequest(
            'GET', `${environment.API_HOST}${url}`, {}, { reportProgress: true, headers: this.acceptHeaders }
        );
        return this.http.request(request);
    }

    public listPaginated<T>(host, url: string, queryParams?: { [key: string]: any }): Observable<PagedResponse<T>> {
        const PAGE_SIZE = queryParams?.['page_size'] || vars.PAGE_SIZE;
        // TODO: Optimize logic
        if (vars.PAGINATION_TYPE === 'link') {
            return this.listResponse<T>(url, queryParams).pipe(
                map(resp => {

                    let count;
                    let current;
                    let last;
                    let pages: PaginationItem[] = [];
                    const linkResp = resp.headers.get('link');
                    if (linkResp) {
                        const links = linkResp.split('; ');
                        const countStr = links.filter(l => l.startsWith('rel="count"')).length > 0 ?
                            links.filter(l => l.startsWith('rel="count"'))[0] : null;
                        const prevL = links.filter(l => l.startsWith('rel="prev"')).length > 0 ?
                            links.filter(l => l.startsWith('rel="prev"'))[0] : null;
                        const nextL = links.filter(l => l.startsWith('rel="next"')).length > 0 ?
                            links.filter(l => l.startsWith('rel="next"'))[0] : null;
                        const firstL = links.filter(l => l.startsWith('rel="first"')).length > 0 ?
                            links.filter(l => l.startsWith('rel="first"'))[0] : null;
                        const lastL = links.filter(l => l.startsWith('rel="last"')).length > 0 ?
                            links.filter(l => l.startsWith('rel="last"'))[0] : null;
                        if (countStr) {
                            count = countStr.split(' ')[1].
                                replace('<', '').replace('>', '');
                        }
                        if (!firstL) {
                            current = 1;
                        } else {
                            if (nextL && nextL.match(pageMatch)) {
                                current = parseInt(nextL.match(pageMatch)[0].split('=')[1], 10) - 1;
                            } else if (prevL && prevL.match(pageMatch)) {
                                current = parseInt(prevL.match(pageMatch)[0].split('=')[1], 10) + 1;
                            }
                        }
                        last = lastL ? parseInt(lastL.match(pageMatch)[0].split('=')[1], 10) : current;
                        pages = this.getPaginationItems(last * PAGE_SIZE, current, PAGE_SIZE);
                    }
                    return {
                        pagination: pages,
                        count: count,
                        results: resp.body
                    };
                })
            );
        }
        // Assumes page_number or limit_offset
        // const regex = vars.PAGINATION_TYPE === 'limit_offset' ? offsetMatch : pageMatch;
        const regex = offsetMatch;
        return this.list(host, url, queryParams).pipe(
            map(
                (resp: { next?: string, previous?: string, count?: number, results?: T[] }) => {
                    let offset = 0;
                    if (resp.next) {
                        if (resp.next.match(regex)) {
                            offset = parseInt(resp.next.match(regex)[0].split('=')[1], 10);
                        }
                    } else if (resp.previous) {
                        if (resp.previous.match(regex)) {
                            offset = parseInt(resp.previous.match(regex)[0].split('=')[1], 10) + (2 * PAGE_SIZE);
                        }
                    }
                    const current = vars.PAGINATION_TYPE === 'limit_offset' ? Math.max(offset / PAGE_SIZE, 1) : offset;
                    const pageItems = this.getPaginationItems(resp?.count || 0, current, PAGE_SIZE);
                    return {
                        pagination: pageItems,
                        count: resp.count,
                        results: resp.results
                    };
                }
            )
        );
    }

    public get<T>(url: string, queryParams: {} = {}): Observable<T> {
        /**
         * Get an object(s) from the database.
         * @url: api endpoint.
         * @return Observable for consumers to subscribe to.
         */
        return this.http.get<T>(
            `${environment.API_HOST}${url}`, { headers: this.acceptHeaders, params: queryParams }
        ).pipe(catchError(err => throwError(err)));
    }

    public fetch<T>(url: string, queryParams: {} = {}): Observable<T> {
        /**
         * Get an object from database.
         * @url: api endpoint.
         * @id: database id of item.
         * @return Observable for consumers to subscribe to.
         */
        return this.get(url, queryParams);
    }

    public retrieve<T>(url: string, id: string, queryParams: {} = {}): Observable<T> {
        /**
         * Get an object from the database.
         * @url: api endpoint.
         * @id: database id of item.
         * @return Observable for consumers to subscribe to.
         */
        return this.get(`${url}${id}/`, queryParams);
    }

    public create<T>(url: string, object: T, queryParams: {} = {}, format = 'application/json', host): Observable<T> {
        /**
         * Create a Generic object T.
         * @return Observable for consumers to subscribe to.
         */
        return this.http.post<T>(
            `${host}${url}`, object, { headers: new HttpHeaders({ 'Content-Type': `${format}` }), params: queryParams }
        ).pipe(catchError(err => throwError(err)));
    }

    public post<T>(host: string, url: string, object: T, queryParams: {} = {}, format = 'application/json'): Observable<T> {
        /**
         * Same as create
         */
        return this.create(url, object, {} = {}, 'application/json', host);
    }

    public postWithProgress<T>(url: string, data?: any): Observable<HttpEvent<{}>> {
        const request = new HttpRequest(
            'POST', `${environment.API_HOST}${url}`, data, { reportProgress: true, headers: this.acceptHeaders }
        );
        return this.http.request(request);
    }

    public put<T>(url, id: string, newObject: T, queryParams: {} = {}, format = 'application/json'): Observable<T> {
        /**
         * Update a database object.
         * @url: api endpoint for the collections.
         * @id: database id of item to be updated.
         * @new_object: the new object instance.
         * @return Observable for consumers to subscribe to.
         */
        return this.http.put<any>(
            `${environment.API_HOST}${url}${id}/`, newObject, { headers: new HttpHeaders({ 'Content-Type': `${format}` }), params: queryParams }
        ).pipe(catchError(err => throwError(err)));
    }

    public patch<T>(url, id?: string, updateParams?: T, queryParams: {} = {}, format = 'application/json'): Observable<T> {
        /**
         * Partially update a database object.
         * @url: api endpoint for the collections.
         * @id: database id of item to be updated.
         * @new_object: the new object instance.
         * @return Observable for consumers to subscribe to.
         */
        return this.http.patch<any>(
            `${environment.API_HOST}${url}${id}/`, updateParams, { headers: new HttpHeaders({ 'Content-Type': `${format}` }), params: queryParams }
        ).pipe(catchError(err => throwError(err)));
    }

    public delete<T>(host: string, url: string, id: string, queryParams: {} = {}): Observable<T> {
        /**
         * Remove object from database.
         * @url: api endpoint.
         * @id: db ID of object to delete.
         */
        return this.http.delete<T>(`${host}${url}${id}/`,
            { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: queryParams }
        ).pipe(catchError(err => throwError(err)));
    }

    public uploadFormData<T>(url: string, formData: FormData, method: 'post' | 'put' | 'patch' = 'post'): any {
        if (method === 'post') {
            return this.http.post(`${environment.API_HOST}${url}`, formData).pipe(catchError(err => throwError(err)));
        } else if (method === 'put') {
            return this.http.put(`${environment.API_HOST}${url}`, formData).pipe(catchError(err => throwError(err)));
        } else {
            return this.http.patch(`${environment.API_HOST}${url}`, formData).pipe(catchError(err => throwError(err)));
        }
    }

    public getPaginationItems(count: any, current: any = 1, pageSize): PaginationItem[] {
        count = parseInt(count, 10);
        current = parseInt(current, 10);
        const totalPages = Math.ceil(count / pageSize);
        const pages: PaginationItem[] = [];
        if (totalPages === 1 || (current * pageSize > totalPages * pageSize)) { return []; }
        pages.push({
            page: current - 1 > 0 ? current - 1 : 1,
            label: '&laquo;',
            disabled: current === 1
        });
        if (current - 1 <= 3) {
            new Array(current - 1).fill(0).forEach((i, ind) => {
                pages.push({ page: ind + 1, label: `${ind + 1}`, disabled: false });
            });
        } else {
            pages.push(...[
                { page: 1, label: '1', disabled: false },
                { page: null, label: '...', disabled: true },
                { page: current - 1, label: `${current - 1}`, disabled: false }
            ]);
        }
        pages.push({ page: current, label: current, disabled: true });
        if (totalPages - current <= 3) {
            new Array(totalPages - current).fill(0).forEach((i, ind) => {
                pages.push({ page: current + ind + 1, label: current + ind + 1, disabled: false });
            });
        } else if (totalPages - current > 3) {
            pages.push({ page: current + 1, label: `${current + 1}`, disabled: false });
            pages.push({ page: null, label: '...', disabled: true });
            pages.push({ page: totalPages, label: `${totalPages}`, disabled: false });
        }
        pages.push({
            page: (current + 1) < totalPages ? current + 1 : totalPages,
            label: '&raquo;',
            disabled: current === totalPages
        });
        return pages;
    }
}
