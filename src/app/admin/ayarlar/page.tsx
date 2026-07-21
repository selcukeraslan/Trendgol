"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { settingsSchema, type SettingsFormValues } from "@/schemas/settings";
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_ABOUT_VALUES,
  DEFAULT_CTA_TEXT,
  DEFAULT_CTA_TITLE,
  DEFAULT_FOOTER_DESCRIPTION,
  DEFAULT_HOW_TO_JOIN_STEPS,
  DEFAULT_PARTICIPATION_TERMS,
} from "@/lib/content-defaults";
import { useSettingsStore } from "@/store/settingsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { ImageUpload } from "@/components/common/image-upload";
import { FileUpload } from "@/components/common/file-upload";

const emptyDefaults: SettingsFormValues = {
  logoUrl: "",
  heroTitle: "",
  heroSubtitle: "",
  prizePool: "",
  entryFee: "",
  perMatchFee: "",
  aboutText: "",
  aboutEyebrow: DEFAULT_ABOUT_CONTENT.eyebrow,
  aboutTitle: DEFAULT_ABOUT_CONTENT.title,
  aboutSubtitle: DEFAULT_ABOUT_CONTENT.subtitle,
  aboutStoryTitle: DEFAULT_ABOUT_CONTENT.storyTitle,
  aboutTeamLabel: DEFAULT_ABOUT_CONTENT.teamLabel,
  aboutPrizePoolLabel: DEFAULT_ABOUT_CONTENT.prizePoolLabel,
  aboutSeason: DEFAULT_ABOUT_CONTENT.season,
  aboutSeasonLabel: DEFAULT_ABOUT_CONTENT.seasonLabel,
  aboutMissionTitle: DEFAULT_ABOUT_CONTENT.missionTitle,
  aboutMissionText: DEFAULT_ABOUT_CONTENT.missionText,
  aboutValuesTitle: DEFAULT_ABOUT_CONTENT.valuesTitle,
  aboutValues: DEFAULT_ABOUT_VALUES,
  aboutCtaTitle: DEFAULT_ABOUT_CONTENT.ctaTitle,
  aboutCtaText: DEFAULT_ABOUT_CONTENT.ctaText,
  aboutCtaButtonLabel: DEFAULT_ABOUT_CONTENT.ctaButtonLabel,
  sponsors: "",
  contact: { phone: "", email: "", address: "", instagram: "", whatsapp: "" },
  rulesPdfUrl: "",
  participationTerms: "",
  howToJoinSteps: [],
  ctaTitle: "",
  ctaText: "",
  footerDescription: "",
};

export default function AdminSettingsPage() {
  const load = useSettingsStore((s) => s.load);
  const loaded = useSettingsStore((s) => s.loaded);
  const settings = useSettingsStore((s) => s.settings);
  const save = useSettingsStore((s) => s.save);

  React.useEffect(() => {
    void load();
  }, [load]);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: emptyDefaults,
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({ control: form.control, name: "howToJoinSteps" });

  React.useEffect(() => {
    if (settings) {
      const terms =
        settings.participationTerms.length > 0
          ? settings.participationTerms
          : DEFAULT_PARTICIPATION_TERMS;
      const steps =
        settings.howToJoinSteps.length > 0
          ? settings.howToJoinSteps
          : DEFAULT_HOW_TO_JOIN_STEPS;
      form.reset({
        ...settings,
        logoUrl: settings.logoUrl ?? "",
        sponsors: (settings.sponsors ?? []).join("\n"),
        contact: {
          phone: settings.contact.phone,
          email: settings.contact.email,
          address: settings.contact.address,
          instagram: settings.contact.instagram ?? "",
          whatsapp: settings.contact.whatsapp ?? "",
        },
        rulesPdfUrl: settings.rulesPdfUrl ?? "",
        participationTerms: terms.join("\n"),
        howToJoinSteps: steps,
        ctaTitle: settings.ctaTitle || DEFAULT_CTA_TITLE,
        ctaText: settings.ctaText || DEFAULT_CTA_TEXT,
        footerDescription:
          settings.footerDescription || DEFAULT_FOOTER_DESCRIPTION,
      });
    }
  }, [settings, form]);

  async function onSubmit(values: SettingsFormValues) {
    const { sponsors, participationTerms, howToJoinSteps, ...rest } = values;
    await save({
      ...rest,
      sponsors: (sponsors ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      participationTerms: (participationTerms ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      howToJoinSteps: howToJoinSteps
        .map((s) => ({ title: s.title.trim(), text: s.text.trim() }))
        .filter((s) => s.title || s.text),
    });
    toast.success("Ayarlar kaydedildi.");
  }

  if (!loaded) {
    return <LoadingSkeleton count={8} />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Site Ayarları
        </h1>
        <p className="text-sm text-muted-foreground">
          Ana sayfa içeriği, ücretler ve iletişim bilgilerini düzenleyin.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Site logosu */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold">Site Logosu</h2>
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      folder="logos"
                      alt="Site logosu önizleme"
                      previewClassName="h-20 w-20"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Navbar ve alt bilgide görünür. Boş bırakılırsa
                    &quot;HS&quot; rozeti gösterilir. Kare/şeffaf PNG önerilir.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Separator />

          {/* Ana sayfa */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold">Ana Sayfa</h2>
            <FormField
              control={form.control}
              name="heroTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Başlığı</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Alt Başlığı</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Separator />

          {/* Ücretler */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold">Ücretler & Ödül</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="prizePool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ödül Havuzu</FormLabel>
                    <FormControl>
                      <Input placeholder="50.000 ₺" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="entryFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Katılım Ücreti</FormLabel>
                    <FormControl>
                      <Input placeholder="2.500 ₺" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="perMatchFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maç Başı Ücret</FormLabel>
                    <FormControl>
                      <Input placeholder="150 ₺" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <Separator />

          {/* Biz Kimiz */}
          <section className="space-y-4">
            <div>
              <h2 className="font-heading font-bold">Biz Kimiz Sayfası</h2>
              <p className="text-xs text-muted-foreground">
                Sayfa başlığını, hikâyeyi, istatistik etiketlerini, misyonu,
                güven kartlarını ve çağrı alanını düzenleyin.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="aboutEyebrow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Üst Etiket</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aboutTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sayfa Başlığı</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="aboutSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sayfa Açıklaması</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aboutStoryTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hikâye Başlığı</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aboutText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hikâye Metni</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FormField
                control={form.control}
                name="aboutTeamLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Takım Etiketi</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aboutPrizePoolLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ödül Etiketi</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aboutSeason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sezon Değeri</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aboutSeasonLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sezon Etiketi</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="aboutMissionTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Misyon Başlığı</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aboutValuesTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Güven Alanı Başlığı</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="aboutMissionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Misyon Metni</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Güven Kartları</FormLabel>
              {DEFAULT_ABOUT_VALUES.map((_, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-[1fr_2fr]"
                >
                  <FormField
                    control={form.control}
                    name={`aboutValues.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Kart başlığı" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`aboutValues.${index}.text`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            rows={2}
                            placeholder="Kart açıklaması"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="aboutCtaTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Çağrı Başlığı</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aboutCtaButtonLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buton Metni</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="aboutCtaText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Çağrı Açıklaması</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Separator />

          {/* Sponsorlar */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold">Sponsorlar</h2>
            <FormField
              control={form.control}
              name="sponsors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sponsor Listesi</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder={"Her satıra bir sponsor adı\nÖrn. SPOR A.Ş."}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Her satır bir sponsor olarak ana sayfada gösterilir. Boş
                    bırakılırsa sponsor alanı gizlenir.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Separator />

          {/* İletişim */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold">İletişim</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="contact.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="contact.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="contact.instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram (opsiyonel)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact.whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp (opsiyonel)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://wa.me/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <Separator />

          {/* Kurallar PDF */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold">Kurallar (PDF)</h2>
            <FormField
              control={form.control}
              name="rulesPdfUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kurallar Dosyası</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                      folder="rules"
                      accept="application/pdf"
                      label="Yüklenen kuralları görüntüle (PDF)"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Yüklenirse ana sayfadaki &quot;Katılım Şartları&quot; ve
                    kaydol bölümünde &quot;Kuralları İncele&quot; linki görünür.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Separator />

          {/* Katılım Şartları */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold">Katılım Şartları</h2>
            <FormField
              control={form.control}
              name="participationTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maddeler</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder={"Her satıra bir madde"}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Her satır bir madde olarak listelenir. Boş bırakılırsa
                    varsayılan maddeler gösterilir.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Separator />

          {/* Nasıl Katılırım adımları */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold">Nasıl Katılırım Adımları</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendStep({ title: "", text: "" })}
              >
                <Plus className="size-4" aria-hidden="true" />
                Adım Ekle
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              İkonlar sıraya göre sabittir; başlık ve açıklamayı düzenleyin.
            </p>
            <div className="space-y-3">
              {stepFields.map((row, index) => (
                <div
                  key={row.id}
                  className="flex items-start gap-2 rounded-lg border border-border p-3"
                >
                  <div className="flex-1 space-y-2">
                    <FormField
                      control={form.control}
                      name={`howToJoinSteps.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Adım başlığı" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`howToJoinSteps.${index}.text`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              rows={2}
                              placeholder="Adım açıklaması"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    aria-label="Adımı kaldır"
                    onClick={() => removeStep(index)}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* CTA bölümü */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold">Alt CTA Bölümü</h2>
            <FormField
              control={form.control}
              name="ctaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Başlık</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ctaText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Separator />

          {/* Footer */}
          <section className="space-y-4">
            <h2 className="font-heading font-bold">Alt Bilgi (Footer)</h2>
            <FormField
              control={form.control}
              name="footerDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanıtım Metni</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Button type="submit" size="lg">
            Ayarları Kaydet
          </Button>
        </form>
      </Form>
    </div>
  );
}
