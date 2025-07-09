import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function findWebappRoot(filePath: string): string | null {
  let dir = path.dirname(filePath);
  while (dir !== path.dirname(dir)) {
    const webapp = path.join(dir, 'webapp');
    if (fs.existsSync(webapp) && fs.statSync(webapp).isDirectory()) {
      return webapp;
    }
    dir = path.dirname(dir);
  }
  return null;
}

function getManifest(webappPath: string): { path: string; content: any } | null {
  const manifestPath = path.join(webappPath, 'manifest.json');
  if (!fs.existsSync(manifestPath)) return null;

  try {
    const raw = fs.readFileSync(manifestPath, 'utf8');
    const json = JSON.parse(raw);
    return { path: manifestPath, content: json };
  } catch {
    return null;
  }
}

function saveManifest(manifestPath: string, content: any) {
  fs.writeFileSync(manifestPath, JSON.stringify(content, null, 2), 'utf8');
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('createUi5View', async () => {
    const viewName = await vscode.window.showInputBox({
      prompt: 'UI5 View adı gir (ör: ProductList)',
      placeHolder: 'View adı'
    });

    if (!viewName) {
      vscode.window.showErrorMessage('View adı girilmedi.');
      return;
    }

    const controllerName = `${viewName}`;
    const activeFileUri = vscode.window.activeTextEditor?.document.uri;
    const activeFilePath = activeFileUri?.fsPath;

    if (!activeFilePath) {
      vscode.window.showErrorMessage('Aktif dosya bulunamadı.');
      return;
    }

    const webappPath = findWebappRoot(activeFilePath);
    if (!webappPath) {
      vscode.window.showErrorMessage('webapp klasörü bulunamadı.');
      return;
    }

    const manifestData = getManifest(webappPath);
    if (!manifestData) {
      vscode.window.showErrorMessage('manifest.json okunamadı.');
      return;
    }

    const manifest = manifestData.content;
    const manifestPath = manifestData.path;
    const namespace = manifest['sap.app']?.id;
    if (!namespace) {
      vscode.window.showErrorMessage('manifest.json içinde sap.app.id bulunamadı.');
      return;
    }

    const viewDir = path.join(webappPath, 'view');
    const controllerDir = path.join(webappPath, 'controller');
    const viewPath = path.join(viewDir, `${controllerName}.view.xml`);
    const controllerPath = path.join(controllerDir, `${controllerName}.controller.js`);

    if (fs.existsSync(viewPath) || fs.existsSync(controllerPath)) {
      vscode.window.showWarningMessage(`❗ ${controllerName} zaten mevcut, işlem yapılmadı.`);
      return;
    }

    const viewContent = `<mvc:View
  controllerName="${namespace}.controller.${controllerName}"
  xmlns:mvc="sap.ui.core.mvc"
  xmlns="sap.m">
  <Page title="${controllerName}">
    <content>
      <Text text="Hello from ${controllerName}" />
    </content>
  </Page>
</mvc:View>`;

    const controllerContent = `sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("${namespace}.controller.${controllerName}", {
    onInit: function () {
      // Init logic
    }
  });
});`;

    try {
      fs.mkdirSync(viewDir, { recursive: true });
      fs.mkdirSync(controllerDir, { recursive: true });
      fs.writeFileSync(viewPath, viewContent, 'utf8');
      fs.writeFileSync(controllerPath, controllerContent, 'utf8');

      // 📦 ROUTING ekle
      const routing = manifest['sap.ui5']?.routing ?? {};
      routing.config = routing.config ?? {
        routerClass: "sap.m.routing.Router",
        viewType: "XML",
        viewPath: `${namespace}.view`,
        controlId: "app",
        controlAggregation: "pages",
        async: true
      };

      routing.routes = routing.routes ?? [];
      routing.targets = routing.targets ?? {};

      if (!routing.targets[viewName]) {
        routing.routes.push({
          name: viewName,
          pattern: viewName.toLowerCase(),
          target: [ viewName ]
        });

        routing.targets[viewName] = {
          viewName: controllerName,
          viewId: controllerName,
          viewLevel: 1
        };
      }

      manifest['sap.ui5'].routing = routing;
      saveManifest(manifestPath, manifest);

      vscode.window.showInformationMessage(`✅ ${controllerName} ve routing başarıyla oluşturuldu.`);
    } catch (err: any) {
      vscode.window.showErrorMessage(`❌ Hata: ${err.message}`);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
