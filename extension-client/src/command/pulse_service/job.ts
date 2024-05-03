/**
 * IBM Cloud Schematics
 * (C) Copyright IBM Corp. 2022 All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as vscode from 'vscode';
import * as api from '../../api';
import * as util from '../../util';

let intervalId: any;

export async function getPlanJson(jobid: string): Promise<any> {
    const isDeployed = util.workspace.isDeployed();
    var res = '';
    if (!isDeployed) {
        vscode.window.showErrorMessage(
            'Workspace not deployed. Make sure you have deployed your workspace.'
        );
        return '';
    }
    
    try {
        vscode.window.showInformationMessage('Generating plan.json');
        res =  await api.getPlanJson(jobid);
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
    return res;
}

export async function runPredictor(planJson: any): Promise<any> {
    const isDeployed = util.workspace.isDeployed();
    var res = '';
    if (!isDeployed) {
        vscode.window.showErrorMessage(
            'Workspace not deployed. Make sure you have deployed your workspace.'
        );
        return '';
    }
    
    try {
        vscode.window.showInformationMessage('Running predictor');
        res =  await api.runPredictor(planJson);    
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
    return res;
}

export async function getPredictedTime(id: string): Promise<any> {
    const isDeployed = util.workspace.isDeployed();
    var res = '';
    if (!isDeployed) {
        vscode.window.showErrorMessage(
            'Workspace not deployed. Make sure you have deployed your workspace.'
        );
        return '';
    }
    
    try {
        vscode.window.showInformationMessage('Getting estimation');
        res =  await api.getPredictedTime(id);    
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
    return res;
}

export async function pollApi(id: string): Promise<boolean> {
    const cred = await util.workspace.readCredentials();
    const apikey = cred.apiKey

    return new Promise((resolve, reject) => {
        intervalId = setInterval(function () {
            api.getPredictorStatus(id)
                .then((res: any) => {
                    console.log(JSON.stringify(res))
                    const status = res.Status;
                    if (status == 'COMPLETED') {
                        clearInterval(intervalId);
                        resolve(status);
                    }
                })
                .catch((err: any) => {
                    reject(err);
                });
        }, 2000);
    });
}